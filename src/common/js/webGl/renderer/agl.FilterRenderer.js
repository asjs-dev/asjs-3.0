require("../NameSpace.js");
require("./agl.BaseRenderer.js");

AGL.FilterRenderer = helpers.createPrototypeClass(
  AGL.BaseRenderer,
  function FilterRenderer(options) {
    options                  = options || {};
    options.config           = AGL.Utils.initRendererConfig(options.config, AGL.FilterRenderer);
    options.config.locations = options.config.locations.concat([
      "uFTex",
      "uFtrT",
      "uFtrV",
      "uFtrK"
    ]);

    this._MAX_BATCH_ITEMS = 1;

    AGL.BaseRenderer.call(this, options);

    this.filters = options.filters || [];
    this.texture = options.texture;

    this._framebuffers = [
      new AGL.Framebuffer(),
      new AGL.Framebuffer()
    ];
  },
  function(_scope, _super) {
    _scope.renderToFramebuffer = function(framebuffer) {
      if (!this._context.isContextLost) {
        this._switchToProgram();
        this._renderBatch(framebuffer);
        framebuffer.unbind(this._gl);
      }
    }

    _scope.destruct = function() {
      this._framebuffers[0].destruct();
      this._framebuffers[1].destruct();

      _super.destruct.call(this);
    }

    _scope._render = function(framebuffer) {
      var context    = this._context;
      var gl         = this._gl;
      var renderTime = this._renderTime;
      var locations  = this._locations;

      context.setBlendMode(AGL.BlendMode.NORMAL);

      this._uploadBuffers();

      context.useTextureAt(this.texture, 0, renderTime, true);
      gl.uniform1i(locations.uTex, 0);

      var l = this.filters.length || 1;
      var minL = l - 2;
      for (var i = 0; i < l; ++i) {
        var filter    = this.filters[i];
        var useFilter = filter && filter.on;

        var filterFramebuffer = null;

        var isLast = i > minL;

        var filterTexture = useFilter && filter.texture;
        if (filterTexture) {
          context.useTextureAt(filterTexture, 1, renderTime, true);
          gl.uniform1i(locations.uFTex, 1);
        }

        if (isLast) {
          if (framebuffer) this._attachFramebuffer(framebuffer);
          else gl.uniform1f(locations.uFlpY, 1);
        } else if (useFilter) {
          filterFramebuffer = this._framebuffers[i & 1];
          this._attachFramebuffer(filterFramebuffer);
        }

        if (useFilter) {
          gl.uniform1fv(locations.uFtrV, filter.v);
          gl.uniformMatrix3fv(locations.uFtrK, false, filter.kernels);
          gl.uniform2i(locations.uFtrT, filter.TYPE, filter.SUB_TYPE);
        }

        (useFilter || isLast) && this._drawInstanced(1);

        filterTexture && context.deactivateTexture(filterTexture);

        if (filterFramebuffer) {
          filterFramebuffer.unbind(gl);
          context.useTextureAt(filterFramebuffer, 0, renderTime, true);
        }
      }
    }

    _scope._createVertexShader = function(options) {
      return AGL.Utils.createVersion(options.config.precision) +

      "in vec2 aPos;" +

      "uniform float uFlpY;" +

      "out vec2 vCrd;" +
      "out vec2 vTCrd;" +

      "void main(void){" +
        "vec3 pos=vec3(aPos*2.-1.,1);" +
        "gl_Position=vec4(pos,1);" +
        "gl_Position.y*=uFlpY;" +
        "vCrd=pos.xy;" +
        "vTCrd=vec2(aPos.x,1.-aPos.y);" +
      "}";
    };

    _scope._createFragmentShader = function(options) {
      return AGL.Utils.createVersion(options.config.precision) +

      "uniform sampler2D uTex;" +
      "uniform sampler2D uFTex;" +

      "uniform ivec2 uFtrT;" +
      "uniform float uFtrV[9];" +
      "uniform mat3 uFtrK;" +

      "in vec2 vCrd;" +
      "in vec2 vTCrd;" +

      "out vec4 oCl;" +

      "void main(void){" +
        "oCl=texture(uTex,vTCrd);" +
        // FILTERS
        "if(uFtrT.x>0){" +
          "float[] vl=uFtrV;" +
          "vec2 oPx=1./vec2(textureSize(uTex,0));" +
          "float v=vl[0];" +
          "vec2 vol=v*oPx;" +
          "vec4 oClVl=oCl*(1.-v);" +
          /*
            CONVOLUTE FILTERS:
              - SharpenFilter
              - EdgeDetectFilter
          */
          "if(uFtrT.x<2){" +
            "mat3 kr=uFtrK*v;" +
            "oCl=vec4((" +
              "texture(uTex,vTCrd-oPx)*kr[0].x+" +
              "texture(uTex,vTCrd+oPx*vec2(0,-1))*kr[0].y+" +
              "texture(uTex,vTCrd+oPx*vec2(1,-1))*kr[0].z+" +
              "texture(uTex,vTCrd+oPx*vec2(-1,0))*kr[1].x+" +
              "oCl*kr[1].y+" +
              "texture(uTex,vTCrd+oPx*vec2(1,0))*kr[1].z+" +
              "texture(uTex,vTCrd+oPx*vec2(-1,1))*kr[2].x+" +
              "texture(uTex,vTCrd+oPx*vec2(0,1))*kr[2].y+" +
              "texture(uTex,vTCrd+oPx)*kr[2].z" +
            ").rgb,oCl.a);" +
          // COLOR MANIPULATION FILTERS
          "}else if(uFtrT.x<3){"+
            // GrayscaleFilter
            "if(uFtrT.y<2)" +
              "oCl=oClVl+vec4(vec3((oCl.r+oCl.g+oCl.b)/3.),oCl.a)*v;" +
            // SepiaFilter
            "else if(uFtrT.y<3)" +
              "oCl=oClVl+vec4(vec3(.874,.514,.156)*((oCl.r+oCl.g+oCl.b)/3.),oCl.a)*v;" +
            // InvertFilter
            "else if(uFtrT.y<4)" +
              "oCl=oClVl+abs(vec4(oCl.rgb-1.,oCl.a))*v;" +
            // TintFilter
            "else if(uFtrT.y<5)" +
              "oCl.rgb*=vec3(vl[2],vl[3],vl[4])*v;" +
            // ColorLimitFilter
            "else if(uFtrT.y<6)" +
              "oCl=vec4((round((oCl.rgb*256.)/v)/256.)*v,oCl.a);" +
            // VignetteFilter
            "else if(uFtrT.y<7){" +
              "vec2 pv=pow(abs(vCrd*v),vec2(vl[1]));" +
              "float cv=clamp(min(1.,(1.-length(pv))*vl[5]),0.,1.);" +
              "oCl.rgb=oCl.rgb*vec3(cv)+vec3(vl[2],vl[3],vl[4])*(1.-cv);" +

            "}" +
            // RainbowFilter
            "else if(uFtrT.y<8)" +
              "oCl.rgb+=vec3(vCrd.xy*.15,(vCrd.x*vCrd.y)*.15)*v;" +
            // BrightnessContrastFilter
            "else if(uFtrT.y<9)" +
              "oCl.rgb=vec3((oCl.rgb-.5)*vl[1]+.5+v);" +
            // GammaFilter
            "else if(uFtrT.y<10)" +
              "oCl.rgb=vec3(pow(oCl.rgb,vec3(v)));" +
          "}" +
          // SAMPLING FILTERS
          "else if(uFtrT.x<4){" +
            "vec2 wh=oPx*vec2(v,vl[1]);" +
            "vec4 cl=vec4(0);" +
            "float c=0.;" +
            "float m;" +
            "float im;" +
            "vec4 tCl;" +
            "if(uFtrT.y<2)" +
              // BlurFilter
              "for(float i=-2.;i<3.;++i){" +
                "for(float j=-2.;j<3.;++j){" +
                  "m=abs(i)+abs(j);" +
                  "im=1.-(m*.25);" +
                  "tCl=i==0.&&j==0." +
                    "?oCl" +
                    ":texture(uTex,vTCrd+(wh*vec2(i,j)));" +
                  "cl+=tCl*im;" +
                  "c+=im;" +
                "}" +
              "}" +
            "else{" +
              // GlowFilter
              "float oAvg=uFtrT.y==2?(oCl.r+oCl.g+oCl.b+oCl.a)/4.:0.;" +
              "for(float i=-2.;i<3.;++i){" +
                "for(float j=-2.;j<3.;++j){" +
                  "m=abs(i)+abs(j);" +
                  "im=1.-(m*.25);" +
                  "tCl=i==0.&&j==0." +
                    "?oCl" +
                    ":texture(uTex,vTCrd+(wh*vec2(i,j)));" +
                  "float avg=(tCl.r+tCl.g+tCl.b+tCl.a)/4.;" +
                  "if(avg-oAvg>=vl[3]*m){" +
                    "cl+=tCl*im*(2.-vl[3]);" +
                    "c+=im;" +
                  "}" +
                "}" +
              "}" +
            "}" +
            "oCl=cl/c;" +
          "}" +
          // PixelateFilter
          "else if(uFtrT.x<5)" +
            "oCl=texture(uTex,floor(vTCrd/vol)*vol);" +
          // DisplacementFilter
          "else if(uFtrT.x<6){" +
            "vec2 dspMd=vec2(1,-1)*(texture(" +
              "uFTex," +
              "mod(vTCrd+vec2(vl[1],vl[2]),1.)" +
            ").rg-.5)*2.*vol;" +
            "oCl=texture(uTex,vTCrd+dspMd);" +
          "}" +
          // MaskFilter
          "else if(uFtrT.x<7){" +
            "vec4 mskCl=texture(uFTex,vTCrd);" +
            "oCl.a*=v<4." +
              "?mskCl[int(v)]" +
              ":(mskCl.r+mskCl.g+mskCl.b+mskCl.a)/4.;" +
          "}" +
        "}" +
      "}";
    };
  }
);
