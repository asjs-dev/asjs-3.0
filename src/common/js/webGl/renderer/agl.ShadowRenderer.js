require("../NameSpace.js");
require("./agl.RendererHelper.js");

AGL.ShadowRenderer = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function ShadowRenderer(config, stage2D) {
    helpers.BasePrototypeClass.call(this);

    config.lightNum       = stage2D._config.lightNum;
    config.isLightEnabled = stage2D._config.isLightEnabled;
    config.vertexShader   = config.vertexShader   || AGL.ShadowRenderer.createVertexShader;
    config.fragmentShader = config.fragmentShader || AGL.ShadowRenderer.createFragmentShader;
    config.locations      = config.locations.concat([
      "aPos",
      "uTex",
      "uLg"
    ]);

    AGL.RendererHelper.initRenderer.call(this, config);

    this.texture               =
    this._currentFilterTexture = null;

    this._stage2D = stage2D;

    this._resize();
  },
  function(_scope, _super) {
    AGL.RendererHelper.createRendererBody.call(_scope, _scope);

    _scope._render = function() {
      this.texture.isNeedToDraw(this._gl, this._renderTime);
      AGL.Utils.useTexture(this._gl, 0, this.texture);

      this._gl.uniformMatrix4fv(this._locations.uLg, false, this._stage2D._lightData);

      this._gl.drawArrays(AGL.Const.TRIANGLE_FAN, 0, 6);
    }

    _scope.destruct = function() {
      this._destructRenderer();

      _super.destruct.call(this);
    }

    _scope._initCustom = function() {
      this._gl.bufferData(AGL.Const.ARRAY_BUFFER, new Float32Array([
          -1, -1,
           1, -1,
          -1,  1,
          -1,  1,
           1,  1,
           1, -1
        ]), AGL.Const.STATIC_DRAW
      );

      this._gl.uniform1i(this._locations.uTex, 0);
    }
  }
);
AGL.ShadowRenderer.createVertexShader = function() {
  return
  "#version 300 es\n" +

  "in vec2 aPos;" +

  "out vec2 vTexCrd;" +
  "out vec2 vGlPos;" +

  "void main(void){" +
    "gl_Position=vec4(aPos,0,1);" +
    "vGlPos=aPos;" +
    "vTexCrd=(aPos+vec2(1,-1))/vec2(2,-2);" +
  "}";
};
AGL.ShadowRenderer.createFragmentShader = function(config) {
var maxLightSources = config.lightNum;

  var shader =
  "#version 300 es\n" +
  "precision " + config.precision + " float;" +

  "in vec2 vTexCrd;" +
  "in vec2 vGlPos;" +

  (
    config.isLightEnabled
      ? "uniform mat4 uLg[" + maxLightSources + "];"
      : ""
  ) +

  "uniform sampler2D uTex;" +

  "out vec4 fgCol;" +

  (
    config.isLightEnabled
      ? "float lgVal(mat4 lg,vec2 oPx){" +
          "vec2 a=vGlPos*lg[1].xw+vGlPos.yx*lg[1].zy+lg[0].xy;" +
          "vec2 aa=a*a;" +
          "float dstA=aa.x+aa.y;" +
          "vec2 b=(((lg[0].xy*vec2(-1,1))/lg[1].xw)+1.)/2.;" +
          "float dst=distance(vTexCrd,b);" +
          "vec2 m=(vTexCrd-b)/dst;" +
          "vec4 c;" +
          "vec2 p;" +
          "vec2 pr=vec2(-1);" +
          "vec2 s;" +
          "vec2 sp;" +
          "for(float i=0.;i<dst;i+=0.01){" +
            "s=i*m;" +
            "sp=floor(s/oPx);" +
            "if(sp==pr)continue;" +
            "pr=sp;" +
            "p=b+s;" +
            "if(p.x<0.||p.y<0.||p.x>1.||p.y>1.)continue;" +
            "c=texture(uTex,p);" +
            "if(c.a>0.){" +
              "return 0.;" +
              "break;" +
            "}" +
          "}" +
          "return clamp(1.-abs(dstA),0.,1.);" +
        "}"
      : ""
  ) +

  "void main(void){" +
    "vec2 oPx=1./vec2(textureSize(uTex,0));" +
    "fgCol=vec4(0);" +
    "float lgv;" +
    "float a=1.;" +
    "float c=0.;";

    if (config.isLightEnabled) {
      for (var i = 0; i < maxLightSources; ++i) {
        shader +=
        "if(uLg[" + i + "][0].w>0.){" +
          "lgv=lgVal(uLg[" + i + "],oPx);" +
          "a-=lgv;" +
          "if(lgv<1.)++c;" +
        "}";
      }
    }

    shader +=
    "fgCol.a=a;" +
  "}";

  return shader;
};
