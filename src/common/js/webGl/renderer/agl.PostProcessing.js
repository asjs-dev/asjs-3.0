require("../NameSpace.js");
require("./agl.RendererHelper.js");

AGL.PostProcessing = createPrototypeClass(
  BasePrototypeClass,
  function PostProcessing(config) {
    BasePrototypeClass.call(this);

    config.vertexShader   = config.vertexShader   || AGL.PostProcessing.createVertexShader;
    config.fragmentShader = config.fragmentShader || AGL.PostProcessing.createFragmentShader;

    Object.freeze(config);

    this.texture = null;
    this.filters = [];

    this._rCount = 0;

    this._config = config;

    AGL.RendererHelper.init.call(this, config.canvas);

    var program = AGL.Utils.createProgram(this._gl, [
      AGL.Utils.loadVertexShader(this._gl,   config.vertexShader(config)),
      AGL.Utils.loadFragmentShader(this._gl, config.fragmentShader(config))
    ]);
    this._locations = AGL.Utils.getLocationsFor(this._gl, program, Object.assign(config.locations, {
      "aPos"    : "getAttribLocation",
      "uTex"    : "getUniformLocation",
      "uDspTex" : "getUniformLocation",
      "uFlpY"   : "getUniformLocation",
      "uFtrT"   : "getUniformLocation",
      "uFtrST"  : "getUniformLocation",
      "uFtrVal" : "getUniformLocation",
      "uTm"     : "getUniformLocation",
    }));

    this._gl.useProgram(program);

    var positionBuf = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionBuf);
    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      new Float32Array([
        0, 0,
        1, 0,
        1, 1,
        0, 1
      ]),
      this._gl.STATIC_DRAW
    );
    this._gl.vertexAttribPointer(this._locations["aPos"], 2, this._gl.FLOAT, false, 0, 0);
    this._gl.enableVertexAttribArray(this._locations["aPos"]);

    this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1,  1,
         1, -1
      ]), this._gl.STATIC_DRAW
    );

    this._gl.uniform1i(this._locations["uTex"],    0);
    this._gl.uniform1i(this._locations["uDspTex"], 2);

    this._rsz();
  },
  function() {
    AGL.RendererHelper.createFunctionality.call(this);

    this._rndr = function() {
      if (!this.texture.loaded) return;
      this._gl.clear(this._gl.COLOR_BUFFER_BIT);

      AGL.Utils.useTexture(this._gl, 0, this.texture);

      this._gl.uniform1f(this._locations["uFlpY"], 1);
      this._gl.uniform1i(this._locations["uFtrT"], 0);
      this._gl.uniform1f(this._locations["uTm"],   ++this._rCount);

      this._gl.drawArrays(this._gl.TRIANGLE_FAN, 0, 6);

      var i;
      var l = this.filters.length;
      for (i = 0; i < l; ++i) {
        var filter = this.filters[i];

        this._gl.uniform1i(this._locations["uTex"],    0);
        this._gl.uniform1i(this._locations["uDspTex"], 2);

        filter.texture && filter.texture.loaded && AGL.Utils.useTexture(this._gl, 2, filter.texture);

        filter.updateFramebuffer(this._gl, this._w, this._h);

        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, filter.framebuffer);

        this._gl.uniform1f(this._locations["uFlpY"],    -1);
        this._gl.uniform1fv(this._locations["uFtrVal"], filter.values);
        this._gl.uniform1i(this._locations["uFtrT"],    filter.type);
        this._gl.uniform1i(this._locations["uFtrST"],   filter.subType);

        this._gl.drawArrays(this._gl.TRIANGLE_FAN, 0, 6);

        filter.bindTexture(this._gl, 0);
      }

      this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);

      this._gl.uniform1f(this._locations["uFlpY"], 1);
      this._gl.uniform1i(this._locations["uFtrT"], 0);

      this._gl.drawArrays(this._gl.TRIANGLE_FAN, 0, 6);
    }
  }
);
AGL.PostProcessing.createVertexShader = function() {
  return "#version 300 es\n" +

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
AGL.PostProcessing.createFragmentShader = function() {
  var shader = "#version 300 es\n" +
  "precision lowp float;\n" +

  "uniform sampler2D uTex;" +
  "uniform sampler2D uDspTex;" +
  "uniform int uFtrT;" +
  "uniform int uFtrST;" +
  "uniform float uFtrVal[9];" +
  "uniform float uTm;" +

  "in vec2 vCrd;" +
  "in vec2 vTexCrd;" +

  "out vec4 fgCol;" +

  "vec4 blur(vec4 oCol,float bx, float by,vec2 crd,vec2 oPx){" +
    "vec4 col=oCol;" +

    "float w=oPx.x*bx;" +
    "float h=oPx.y*by;" +

    "for(float i=-2.;i<3.;++i){" +
  		"for(float j=-2.;j<3.;++j){" +
  			"if(i!=0.&&j!=0.)col+=texture(uTex,crd+vec2(i*w,j*h));" +
      "}" +
    "}" +

    "return col/25.;" +
  "}"+

  "vec4 glw(vec4 oCol,float bx, float by,vec2 crd,vec2 oPx){" +
    "float oAvg=(oCol.r+oCol.g+oCol.b)/3.;" +
    "vec4 col=oCol;" +

    "float w=oPx.x*bx;" +
    "float h=oPx.y*by;" +

    "float c=1.;" +

    "for(float i=-3.;i<4.;++i){" +
  		"for(float j=-3.;j<4.;++j){" +
        "vec4 tCol=texture(uTex,crd+vec2(i*w,j*h));" +
        "float avg=(tCol.r+tCol.g+tCol.b)/3.;" +
        "if(avg>oAvg){" +
          "col+=tCol;" +
          "c++;" +
        "}" +
      "}" +
    "}" +

    "return col/c;" +
  "}"+

  "vec4 convMat(vec4 oCol,float v[9],vec2 crd,vec2 oPx){" +
    "return (" +
      "texture(uTex,crd-oPx)*v[0]+" +
      "texture(uTex,crd+vec2(0,-oPx.y))*v[1]+" +
      "texture(uTex,crd+vec2(oPx.x,-oPx.y))*v[2]+" +
      "texture(uTex,crd+vec2(-oPx.x,0))*v[3]+" +
      "oCol*v[4]+" +
      "texture(uTex,crd+vec2(oPx.x,0))*v[5]+" +
      "texture(uTex,crd+vec2(-oPx.x,oPx.y))*v[6]+" +
      "texture(uTex,crd+vec2(0,oPx.y))*v[7]+" +
      "texture(uTex,crd+oPx)*v[8]" +
    ")/9.;" +
  "}"+

  "vec4 pxlt(float v,vec2 crd,vec2 oPx){" +
    "vec2 vol=v*oPx;" +
    "return texture(uTex,floor(crd/vol)*vol);" +
  "}"+

  "void main(void){" +
    "float[] fvl=uFtrVal;" +
    "vec2 oSz=vec2(textureSize(uTex,0));" +
    "vec2 oPx=vec2(1)/oSz;" +
    "fgCol=texture(uTex,vTexCrd);" +
    // FILTERS
    "if(uFtrT>0){" +
      /*
        CONVOLUTE FILTERS:
          - SharpenFilter
          - EdgeDetectFilter
      */
      "if(uFtrT<2)fgCol=convMat(fgCol,fvl,vTexCrd,oPx);" +
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
        "else if(uFtrST<4)fgCol=abs(vec4(fgCol.rgb-1.,fgCol.a));" +
        // TintFilter
        "else if(uFtrST<5)" +
          "fgCol=vec4(" +
            "fgCol.rgb*vec3(fvl[0],fvl[1],fvl[2])," +
            "fgCol.a);" +
        // ColorLimitFilter
        "else if(uFtrST<6)" +
          "fgCol=vec4(" +
            "(round((fgCol.rgb*256.)/fvl[0])/256.)*fvl[0]," +
            "fgCol.a);" +
        // VignetteFilter
        "else if(uFtrST<7)" +
          "fgCol*=vec4(" +
            "vec3((1.-sqrt(pow(vCrd.x,4.)+pow(vCrd.y,4.))))," +
            "1);" +
        // RainbowFilter
        "else if(uFtrST<8)fgCol+=vec4(vCrd.xy*.15,(vCrd.x-vCrd.y)*.15,0);" +
        // LinesFilter
        "else if(uFtrST<9)fgCol*=vec4(.2+sin(vCrd.y*500.)*.5);" +
        // BrightnessContrastFilter
        "else if(uFtrST<10)fgCol=vec4((fgCol.rgb-.5)*fvl[1]+.5+fvl[0],fgCol.a);" +
        // GammaFilter
        "else if(uFtrST<11)fgCol=vec4(" +
          "pow(fgCol.rgb,vec3(fvl[0]))," +
          "fgCol.a);" +
      "}" +
      // BlurFilter
      "else if(uFtrT<4)fgCol=blur(fgCol,fvl[0],fvl[1],vTexCrd,oPx);" +
      // PixelateFilter
      "else if(uFtrT<5)fgCol=pxlt(fvl[0],vTexCrd,oPx);" +
      // GlowFilter
      "else if(uFtrT<6)fgCol=glw(fgCol,fvl[0],fvl[1],vTexCrd,oPx);" +
      // DisplacementFilter
      "else if(uFtrT<7){" +
        "vec2 dspMd=vec2(1,-1)*(texture(" +
          "uDspTex," +
          "fract(vec2(1,-1)*vCrd*.5+vec2(.5)+uTm*vec2(fvl[1],fvl[2]))" +
        ").rg-.5)*2.*oPx*fvl[0];" +
        "vec2 mdPs=vTexCrd+dspMd;" +
        "if(mdPs.x>=.0&&mdPs.y>=.0&&mdPs.x<=1.&&mdPs.y<=1.)fgCol=texture(uTex,mdPs);" +
      "}" +
    "}" +
  "}";

  return shader;
};
