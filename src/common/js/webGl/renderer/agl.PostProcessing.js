require("../NameSpace.js");
require("./agl.RendererHelper.js");

AGL.PostProcessing = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function PostProcessing(config) {
    helpers.BasePrototypeClass.call(this);

    config.vertexShader   = config.vertexShader   || AGL.PostProcessing.createVertexShader;
    config.fragmentShader = config.fragmentShader || AGL.PostProcessing.createFragmentShader;
    config.locations      = Object.assign(config.locations, {
      "aPos"    : "getAttribLocation",
      "uTex"    : "getUniformLocation",
      "uDspTex" : "getUniformLocation",
      "uFlpY"   : "getUniformLocation",
      "uFtrT"   : "getUniformLocation",
      "uFtrST"  : "getUniformLocation",
      "uFtrVal" : "getUniformLocation",
      "uFtrKer" : "getUniformLocation",
    });

    this.filters = [];

    AGL.RendererHelper.initRenderer.call(this, config);

    this.texture              =
    this._latestFilterTexture = null;

    this._resize();
  },
  function(_scope, _super) {
    AGL.RendererHelper.createRendererBody.call(_scope, _scope);

    _scope._render = function() {
      if (this.texture.loaded) {
        this.texture.isNeedToDraw(this._gl, this._renderTime);
        AGL.Utils.useTexture(this._gl, 0, this.texture);
        this._gl.uniform1f(this._locations["uFlpY"], 1);

        this.clear();

        var l = this.filters.length;
        var minL = l - 2;
        var filter;
        var isLast;
        var frameBuffer;
        for (var i = 0; i < l; ++i) {
          filter = this.filters[i];

          isLast = i > minL;

          frameBuffer = null;

          if (
            filter.texture && filter.texture.loaded &&
            (filter.texture.isNeedToDraw(this._gl, this._renderTime) || this._latestFilterTexture !== filter.texture)
          ) {
            AGL.Utils.useTexture(this._gl, 1, filter.texture);
            this._latestFilterTexture = filter.texture;
          }

          if (isLast) {
            this._gl.bindFramebuffer(AGL.Consts.FRAMEBUFFER, null);
            this._gl.uniform1f(this._locations["uFlpY"], 1);
          } else {
            frameBuffer = this._frameBuffers[i % 2];
            frameBuffer.isNeedToDraw(this._gl, this._width, this._height);
            this._gl.bindFramebuffer(AGL.Consts.FRAMEBUFFER, frameBuffer.framebuffer);
            this._gl.uniform1f(this._locations["uFlpY"], -1);
          }

          this._gl.uniform1fv(this._locations["uFtrVal"], filter.values);
          this._gl.uniform1fv(this._locations["uFtrKer"], filter.kernels);
          this._gl.uniform1i(this._locations["uFtrT"],    filter.type);
          this._gl.uniform1i(this._locations["uFtrST"],   filter.subType);

          this._gl.drawArrays(AGL.Consts.TRIANGLE_FAN, 0, 6);

          frameBuffer && !isLast && AGL.Utils.bindTexture(this._gl, 0, frameBuffer);
        }
      }
    }

    _scope.destruct = function() {
      this._frameBuffers[0].destruct();
      this._frameBuffers[1].destruct();
      this._frameBuffers.length = 0;

      this.texture              =
      this.filters              =
      this._latestFilterTexture =
      this._frameBuffers        = null;

      this._destructRenderer();

      _super.destruct.call(this);
    }

    _scope._initCustom = function() {
      this._gl.bufferData(AGL.Consts.ARRAY_BUFFER, new Float32Array([
          -1, -1,
           1, -1,
          -1,  1,
          -1,  1,
           1,  1,
           1, -1
        ]), AGL.Consts.STATIC_DRAW
      );

      this._frameBuffers = [
        new AGL.Framebuffer(),
        new AGL.Framebuffer()
      ];

      this._gl.uniform1i(this._locations["uTex"],    0);
      this._gl.uniform1i(this._locations["uDspTex"], 1);
    }
  }
);
AGL.PostProcessing.createVertexShader = function() {
  return
  "#version 300 es\n" +

  "in vec2 aPos;" +

  "uniform float uFlpY;" +

  "out vec2 vCrd;" +
  "out vec2 vTexCrd;" +

  "void main(void){" +
    "gl_Position=vec4(aPos.xy,0,1);" +
    "gl_Position.y*=uFlpY;" +
    "vCrd=aPos;" +
    "vTexCrd=(aPos+vec2(1,-1))/vec2(2,-2);" +
  "}";
};
AGL.PostProcessing.createFragmentShader = function(config) {
  return
  "#version 300 es\n" +
  "precision " + config.precision + " float;" +

  "uniform sampler2D uTex;" +
  "uniform sampler2D uDspTex;" +

  "uniform int uFtrT;" +
  "uniform int uFtrST;" +
  "uniform float uFtrVal[9];" +
  "uniform float uFtrKer[9];" +

  "in vec2 vCrd;" +
  "in vec2 vTexCrd;" +

  "out vec4 fgCol;" +

  "void main(void){" +
    "fgCol=texture(uTex,vTexCrd);" +
    // FILTERS
    "if(uFtrT>0){" +
      "float[] fvl=uFtrVal;" +
      "float[] fkr=uFtrKer;" +
      "vec2 oPx=1./vec2(textureSize(uTex,0));" +
      "vec2 vol=fvl[0]*oPx;" +
      /*
        CONVOLUTE FILTERS:
          - SharpenFilter
          - EdgeDetectFilter
      */
      "if(uFtrT<2)" +
        "fgCol=fvl[0]*(" +
          "texture(uTex,vTexCrd-oPx)*fkr[0]+" +
          "texture(uTex,vTexCrd+oPx*vec2(0,-1))*fkr[1]+" +
          "texture(uTex,vTexCrd+oPx*vec2(1,-1))*fkr[2]+" +
          "texture(uTex,vTexCrd+oPx*vec2(-1,0))*fkr[3]+" +
          "fgCol*fkr[4]+" +
          "texture(uTex,vTexCrd+oPx*vec2(1,0))*fkr[5]+" +
          "texture(uTex,vTexCrd+oPx*vec2(-1,1))*fkr[6]+" +
          "texture(uTex,vTexCrd+oPx*vec2(0,1))*fkr[7]+" +
          "texture(uTex,vTexCrd+oPx)*fkr[8]" +
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
          "float v=max(0.,min(1.,(1.-sqrt(pv.x+pv.y))*fvl[5]));" +
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
        "float avg;" +
        "if(uFtrST<2)" +
          // BlurFilter
          "for(float i=-1.;i<2.;++i){" +
            "for(float j=-1.;j<2.;++j){" +
              "m=abs(i*j);" +
              "im=1.-m;" +
              "tCol=i==0.&&j==0." +
                "?fgCol" +
                ":texture(uTex,vTexCrd+(wh*vec2(i,j)));" +
              "col+=tCol*im;" +
              "c+=im;" +
            "}" +
          "}" +
        "else{" +
          // GlowFilter
          "float oAvg=uFtrST==2?(fgCol.r+fgCol.g+fgCol.b+fgCol.a)/4.:0.;" +
          "for(float i=-1.;i<2.;++i){" +
            "for(float j=-1.;j<2.;++j){" +
              "m=abs(i*j);" +
              "im=1.-m;" +
              "tCol=i==0.&&j==0." +
                "?fgCol" +
                ":texture(uTex,vTexCrd+(wh*vec2(i,j)));" +
              "avg=(tCol.r+tCol.g+tCol.b+tCol.a)/4.;" +
              "if(avg-oAvg>=fvl[3]*m){" +
                "col+=tCol*im;" +
                "c+=im;" +
              "}" +
            "}" +
          "}" +
        "}" +
        "fgCol=col/c;" +
      "}" +
      // PixelateFilter
      "else if(uFtrT<5)" +
        "fgCol=texture(uTex,floor(vTexCrd/vol)*vol);" +
      // DisplacementFilter
      "else if(uFtrT<6){" +
        "vec2 flp=vec2(1,-1);" +
        "vec2 dspMd=flp*(texture(" +
          "uDspTex," +
          "mod(flp*(vCrd*.5+.5)+vec2(fvl[1],fvl[2]),1.)" +
        ").rg-.5)*2.*vol;" +
        "vec2 mdPs=vTexCrd+dspMd;" +
        "fgCol=texture(uTex,mdPs);" +
      "}" +
    "}" +
  "}";
};
