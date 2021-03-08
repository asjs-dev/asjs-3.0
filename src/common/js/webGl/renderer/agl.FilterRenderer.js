require("../NameSpace.js");
require("./agl.BaseRenderer.js");

AGL.FilterRenderer = helpers.createPrototypeClass(
  AGL.BaseRenderer,
  function FilterRenderer(options) {
    options = options || {};

    options.config = AGL.Utils.initConfig(options.config, AGL.FilterRenderer);

    options.config.locations = options.config.locations.concat([
      "uFTex",
      "uFtrT",
      "uFtrST",
      "uFtrV",
      "uFtrK"
    ]);

    //this._currentFilterTexture = null;

    this.filters = options.filters || [];

    AGL.BaseRenderer.call(this, options.config);

    this.texture = options.texture;
  },
  function(_scope, _super) {
    _scope.renderToTexture = function(framebuffer) {
      this._gl.useProgram(this._program);
      this._renderBatch(framebuffer);
    }

    _scope._render = function(framebuffer) {
      this._gl.uniform1i(this._locations.uTex, 0);
      this._gl.uniform1f(this._locations.uFlpY, 1);
      this.texture.isNeedToDraw(this._gl, this._renderTime) && this.texture.useTexture(0);

      this.clear();

      var l = this.filters.length || 1;
      var minL = l - 2;
      for (var i = 0; i < l; ++i) {
        var filter    = this.filters[i];
        var useFilter = filter && filter.on;

        var filterFramebuffer = null;

        var isLast = i > minL;

        if (
          useFilter &&
          filter.texture &&
          (filter.texture.isNeedToDraw(this._gl, this._renderTime) || this._currentFilterTexture !== filter.texture)
        ) {
          this._currentFilterTexture = filter.texture;
          this._gl.uniform1i(this._locations.uFTex, 1);
          filter.texture.useTexture(1);
        }

        if (isLast) {
          if (framebuffer) {
            this._attachFramebuffer(framebuffer);
          } else {
            AGL.Utils.unbindFrameBuffer(this._gl);
            this._gl.uniform1f(this._locations.uFlpY, 1);
          }
        } else if (useFilter) {
          filterFramebuffer = this._framebuffers[i & 1];
          this._attachFramebuffer(filterFramebuffer);
        }

        if (useFilter) {
          this._gl.uniform1fv(this._locations.uFtrV, filter.v);
          this._gl.uniform1fv(this._locations.uFtrK, filter.kernels);
          this._gl.uniform1i(this._locations.uFtrT,  filter.TYPE);
          this._gl.uniform1i(this._locations.uFtrST, filter.SUB_TYPE);
        }

        (useFilter || isLast) && this._gl.drawArrays({{AGL.Const.TRIANGLE_FAN}}, 0, 4);

        filterFramebuffer && filterFramebuffer.useTexture(0);
      }

      framebuffer && AGL.Utils.unbindFrameBuffer(this._gl);

      this._gl.flush();
    }

    _scope.destruct = function() {
      this._framebuffers[0].destruct();
      this._framebuffers[1].destruct();

      _super.destruct.call(this);
    }

    _scope._initCustom = function() {
      this._framebuffers = [
        new AGL.Framebuffer(),
        new AGL.Framebuffer()
      ];
    }
  }
);
AGL.FilterRenderer.createVertexShader = function(config) {
  return AGL.Utils.createVersion(config.precision) +

  "in vec2 aPos;" +

  "uniform float uFlpY;" +

  "out vec2 vCrd;" +
  "out vec2 vTCrd;" +

  "void main(void){" +
    "vec3 pos=vec3(aPos*2.-1.,1);" +
    "gl_Position=vec4(pos,1);" +
    "gl_Position.y*=uFlpY;" +
    "vCrd=pos.xy;" +
    "vTCrd=(pos.xy+vec2(1,-1))/vec2(2,-2);" +
  "}";
};
AGL.FilterRenderer.createFragmentShader = function(config) {
  return AGL.Utils.createVersion(config.precision) +

  "uniform sampler2D uTex;" +
  "uniform sampler2D uFTex;" +

  "uniform int uFtrT;" +
  "uniform int uFtrST;" +
  "uniform float uFtrV[9];" +
  "uniform float uFtrK[9];" +

  "in vec2 vCrd;" +
  "in vec2 vTCrd;" +

  "out vec4 fgCol;" +

  "void main(void){" +
    "fgCol=texture(uTex,vTCrd);" +
    // FILTERS
    "if(uFtrT>0){" +
      "float[] fvl=uFtrV;" +
      "float[] fkr=uFtrK;" +
      "vec2 oPx=1./vec2(textureSize(uTex,0));" +
      "vec2 vol=fvl[0]*oPx;" +
      /*
        CONVOLUTE FILTERS:
          - SharpenFilter
          - EdgeDetectFilter
      */
      "if(uFtrT<2)" +
        "fgCol=fvl[0]*(" +
          "texture(uTex,vTCrd-oPx)*fkr[0]+" +
          "texture(uTex,vTCrd+oPx*vec2(0,-1))*fkr[1]+" +
          "texture(uTex,vTCrd+oPx*vec2(1,-1))*fkr[2]+" +
          "texture(uTex,vTCrd+oPx*vec2(-1,0))*fkr[3]+" +
          "fgCol*fkr[4]+" +
          "texture(uTex,vTCrd+oPx*vec2(1,0))*fkr[5]+" +
          "texture(uTex,vTCrd+oPx*vec2(-1,1))*fkr[6]+" +
          "texture(uTex,vTCrd+oPx*vec2(0,1))*fkr[7]+" +
          "texture(uTex,vTCrd+oPx)*fkr[8]" +
        ")/9.;" +
      // COLOR MANIPULATION FILTERS
      "else if(uFtrT<3){"+
        // GrayscaleFilter
        "if(uFtrST<2)" +
          "fgCol=vec4(" +
            "vec3((fgCol.r+fgCol.g+fgCol.b)/3.)," +
            "fgCol.a);" +
        // SepiaFilter
        "else if(uFtrST<3)" +
          "fgCol=vec4(" +
            "vec3(.874,.514,.156)*((fgCol.r+fgCol.g+fgCol.b)/3.)," +
            "fgCol.a);" +
        // InvertFilter
        "else if(uFtrST<4)" +
          "fgCol=abs(vec4(fgCol.rgb-1.,fgCol.a));" +
        // TintFilter
        "else if(uFtrST<5)" +
          "fgCol=vec4(" +
            "(fgCol.rgb*(1.-fvl[0]))+(vec3(fvl[2],fvl[3],fvl[4])*fvl[0])," +
            "fgCol.a);" +
        // ColorLimitFilter
        "else if(uFtrST<6)" +
          "fgCol=vec4(" +
            "(round((fgCol.rgb*256.)/fvl[0])/256.)*fvl[0]," +
            "fgCol.a);" +
        // VignetteFilter
        "else if(uFtrST<7){" +
          "vec2 pv=pow(abs(vCrd*fvl[0]),vec2(fvl[1]));" +
          "float v=clamp(min(1.,(1.-length(pv))*fvl[5]),0.,1.);" +
          "fgCol*=vec4(vec3(v),fgCol.a);" +
          "fgCol+=vec4(vec3(fvl[2],fvl[3],fvl[4])*(1.-v),0);" +
        "}" +
        // RainbowFilter
        "else if(uFtrST<8)" +
          "fgCol+=vec4(vCrd.xy*.15,(vCrd.x-vCrd.y)*.15,0);" +
        // BrightnessContrastFilter
        "else if(uFtrST<9)" +
          "fgCol=vec4(" +
            "(fgCol.rgb-.5)*fvl[1]+.5+fvl[0]," +
            "fgCol.a);" +
        // GammaFilter
        "else if(uFtrST<10)" +
          "fgCol=vec4(" +
            "pow(fgCol.rgb,vec3(fvl[0]))," +
            "fgCol.a);" +
      "}" +
      // SAMPLING FILTERS
      "else if(uFtrT<4){" +
        "vec2 wh=oPx*vec2(fvl[0],fvl[1]);" +
        "vec4 col=vec4(0);" +
        "float c=0.;" +
        "float m;" +
        "float im;" +
        "vec4 tCol;" +
        "if(uFtrST<2)" +
          // BlurFilter
          "for(float i=-2.;i<3.;++i){" +
            "for(float j=-2.;j<3.;++j){" +
              "m=abs(i)+abs(j);" +
              "im=1.-(m*.25);" +
              "tCol=i==0.&&j==0." +
                "?fgCol" +
                ":texture(uTex,vTCrd+(wh*vec2(i,j)));" +
              "col+=tCol*im;" +
              "c+=im;" +
            "}" +
          "}" +
        "else{" +
          // GlowFilter
          "float oAvg=uFtrST==2?(fgCol.r+fgCol.g+fgCol.b+fgCol.a)/4.:0.;" +
          "for(float i=-2.;i<3.;++i){" +
            "for(float j=-2.;j<3.;++j){" +
              "m=abs(i)+abs(j);" +
              "im=1.-(m*.25);" +
              "tCol=i==0.&&j==0." +
                "?fgCol" +
                ":texture(uTex,vTCrd+(wh*vec2(i,j)));" +
              "float avg=(tCol.r+tCol.g+tCol.b+tCol.a)/4.;" +
              "if(avg-oAvg>=fvl[3]*m){" +
                "col+=tCol*im*(2.-fvl[3]);" +
                "c+=im;" +
              "}" +
            "}" +
          "}" +
        "}" +
        "fgCol=col/c;" +
      "}" +
      // PixelateFilter
      "else if(uFtrT<5)" +
        "fgCol=texture(uTex,floor(vTCrd/vol)*vol);" +
      // DisplacementFilter
      "else if(uFtrT<6){" +
        "vec2 flp=vec2(1,-1);" +
        "vec2 dspMd=flp*(texture(" +
          "uFTex," +
          "mod(flp*(vCrd*.5+.5)+vec2(fvl[1],fvl[2]),1.)" +
        ").rg-.5)*2.*vol;" +
        "fgCol=texture(uTex,vTCrd+dspMd);" +
      "}" +
    "}" +
  "}";
};
