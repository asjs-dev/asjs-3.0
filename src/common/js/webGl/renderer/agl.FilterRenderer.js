import "../NameSpace.js";
import "./agl.BaseRenderer.js";

AGL.FilterRenderer = class extends AGL.BaseRenderer {
  constructor(options) {
    options = options || {};
    options.config = AGL.Utils.initRendererConfig(
      options.config,
      AGL.FilterRenderer
    );
    options.config.locations = options.config.locations.concat([
      "uFTex",
      "uFtrT",
      "uFtrV",
      "uFtrK"
    ]);
    options.maxBatchItems = 1;

    super(options);

    this.filters = options.filters || [];
    this.texture = options.texture;

    this._framebuffers = [
      new AGL.Framebuffer(),
      new AGL.Framebuffer()
    ];
  }

  destruct() {
    this._framebuffers[0].destruct();
    this._framebuffers[1].destruct();

    super.destruct();
  }

  _attachFramebufferAlias() {};

  _render(framebuffer) {
    const context = this._context;
    const gl = this._gl;
    const renderTime = this._renderTime;
    const locations = this._locations;

    context.setBlendMode(AGL.BlendMode.NORMAL);

    this._uploadBuffers();

    context.useTextureAt(this.texture, 0, renderTime, true);
    gl.uniform1i(locations.uTex, 0);

    const l = this.filters.length || 1;
    const minL = l - 2;

    for (let i = 0; i < l; ++i) {
      let filterFramebuffer;

      const filter = this.filters[i];
      const useFilter = filter && filter.on;

      const isLast = i > minL;

      const filterTexture = useFilter &&
        filter.textureProps &&
        filter.textureProps.texture;
      if (filterTexture) {
        context.useTextureAt(filterTexture, 1, renderTime, true);
        gl.uniform1i(locations.uFTex, 1);
      }

      if (isLast)
        framebuffer
          ? this._attachFramebuffer(framebuffer)
          : gl.uniform1f(locations.uFlpY, 1);
      else if (useFilter) {
        filterFramebuffer = this._framebuffers[i & 1];
        this._attachFramebuffer(filterFramebuffer);
      }

      if (useFilter) {
        gl.uniform1fv(locations.uFtrV, filter.v);
        gl.uniformMatrix4fv(locations.uFtrK, false, filter.kernels);
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

  _createVertexShader(options) {
    return AGL.Utils.createVersion(options.config.precision) +
    "in vec2 aPos;" +

    "uniform float uFlpY;" +

    "out vec2 " +
      "vCrd," +
      "vTCrd;" +

    "void main(void){" +
      "vec4 pos=vec4(aPos*2.-1.,1,1);" +
      "gl_Position=pos;" +
      "gl_Position.y*=uFlpY;" +
      "vCrd=pos.xy;" +
      "vTCrd=vec2(aPos.x,1.-aPos.y);" +
    "}";
  }

  _createFragmentShader(options) {
    return AGL.Utils.createVersion(options.config.precision) +
    "uniform sampler2D " +
      "uTex," +
      "uFTex;" +
    "uniform ivec2 uFtrT;" +
    "uniform float uFtrV[9];" +
    "uniform mat4 uFtrK;" +

    "in vec2 " +
      "vCrd," +
      "vTCrd;" +

    "out vec4 oCl;" +

    "void main(void){" +
      "oCl=texture(uTex,vTCrd);" +
      // FILTERS
      "if(uFtrT.x>0){" +
        "float[] vl=uFtrV;" +
        "float v=vl[0];" +

        "vec2 " +
          "oPx=1./vec2(textureSize(uTex,0))," +
          "vol=v*oPx;" +
        /*
          CONVOLUTE FILTERS:
            - SharpenFilter
            - EdgeDetectFilter
        */
        "if(uFtrT.x<2){" +
          "mat4 kr=uFtrK*v;" +
          "oCl=vec4((" +
            "texture(uTex,vTCrd-oPx)*kr[0].x+" +
            "texture(uTex,vTCrd+oPx*vec2(0,-1))*kr[0].y+" +
            "texture(uTex,vTCrd+oPx*vec2(1,-1))*kr[0].z+" +
            "texture(uTex,vTCrd+oPx*vec2(-1,0))*kr[0].w+" +
            "oCl*kr[1].x+" +
            "texture(uTex,vTCrd+oPx*vec2(1,0))*kr[1].y+" +
            "texture(uTex,vTCrd+oPx*vec2(-1,1))*kr[1].z+" +
            "texture(uTex,vTCrd+oPx*vec2(0,1))*kr[1].w+" +
            "texture(uTex,vTCrd+oPx)*kr[2].x" +
          ").rgb,oCl.a);" +
        /*
          COLORMATRIX FILTERS:
            - Saturate
        */
        "}else if(uFtrT.x<3){" +
          "mat4 kr=uFtrK;" +
          "oCl.rgb=vec3(" +
            "kr[0].r*oCl.r+kr[0].g*oCl.g+kr[0].b*oCl.b+kr[0].a," +
            "kr[1].r*oCl.r+kr[1].g*oCl.g+kr[1].b*oCl.b+kr[1].a," +
            "kr[2].r*oCl.r+kr[2].g*oCl.g+kr[2].b*oCl.b+kr[2].a" +
          ");" +
        // COLOR MANIPULATION FILTERS
        "}else if(uFtrT.x<4){"+
          "vec4 oClVl=oCl*(1.-v);" +
          // GrayscaleFilter
          "if(uFtrT.y<2)" +
            "oCl=oClVl+vec4(vec3((oCl.r+oCl.g+oCl.b)/3.),oCl.a)*v;" +
          // SepiaFilter
          "else if(uFtrT.y<3)" +
            "oCl=oClVl+" +
              "vec4(vec3(.874,.514,.156)*((oCl.r+oCl.g+oCl.b)/3.),oCl.a)*v;" +
          // InvertFilter
          "else if(uFtrT.y<4)" +
            "oCl=oClVl+vec4(1.-oCl.rgb,oCl.a)*v;" +
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
        "else if(uFtrT.x<5){" +
          "vec2 wh=oPx*vec2(v,vl[1]);" +

          "vec4 " +
            "cl," +
            "tCl;" +

          "float " +
            "c," +
            "m," +
            "im;" +

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
            "float oAvg=uFtrT.y==2" +
              "?(oCl.r+oCl.g+oCl.b+oCl.a)/4." +
              ":0.;" +
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
        "else if(uFtrT.x<6)" +
          "oCl=texture(uTex,floor(vTCrd/vol)*vol);" +
        // DisplacementFilter
        "else if(uFtrT.x<7){" +
          "vec2 dspMd=vec2(1,-1)*(texture(" +
            "uFTex," +
            "mod(vec2(vl[1],vl[2])+vTCrd,1.)*vec2(vl[5]-vl[3],vl[6]-vl[4])" +
          ").rg-.5)*2.*vol;" +
          "oCl=texture(uTex,vTCrd+dspMd);" +
        "}" +
        // MaskFilter
        "else if(uFtrT.x<8){" +
          "vec4 mskCl=texture(uFTex," +
            "mod(vec2(vl[1],vl[2])+vTCrd,1.)*vec2(vl[5]-vl[3],vl[6]-vl[4])" +
          ");" +
          "oCl.a*=v<4." +
            "?mskCl[int(v)]" +
            ":(mskCl.r+mskCl.g+mskCl.b+mskCl.a)/4.;" +
        "}" +
      "}" +
    "}";
  }
}
