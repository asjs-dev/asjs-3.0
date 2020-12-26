require("../NameSpace.js");
require("./agl.RendererHelper.js");

AGL.ShadowRenderer = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function ShadowRenderer(config) {
    helpers.BasePrototypeClass.call(this);

    config.contextAttributes       = config.contextAttributes || {};
    config.contextAttributes.alpha = true;

    config.vertexShader   = config.vertexShader   || AGL.ShadowRenderer.createVertexShader;
    config.fragmentShader = config.fragmentShader || AGL.ShadowRenderer.createFragmentShader;
    config.locations      = config.locations.concat([
      "aPos",
      "uTex",
      "uLg"
    ]);

    AGL.RendererHelper.initRenderer.call(this, config);

    this.texture = null;

    this._currentFilterTexture = null;

    this._lightData = new Float32Array(config.lightNum * 16);

    this._lights = [];

    var l = config.lightNum;
    for (var i = 0; i < l; ++i) this._lights.push(new AGL.Light(i, this._lightData));
  },
  function(_scope, _super) {
    AGL.RendererHelper.createRendererBody.call(_scope, _scope);

    helpers.get(_scope, "stage",  function() { return this; });

    _scope._render = function() {
      this._gl.uniformMatrix4fv(this._locations.uLg, false, this._lightData);

      if (this.texture && this.texture.isNeedToDraw(this._gl, this._renderTime))
        AGL.Utils.useTexture(this._gl, 0, this.texture);

      this._gl.drawArrays(AGL.Const.TRIANGLE_FAN, 0, 6);
    }

    _scope.destruct = function() {
      this._destructRenderer();

      _super.destruct.call(this);
    }

    _scope.getLight = function(id) {
      return this._lights[id];
    }

    _scope._initCustom = function() {
      this._gl.bufferData(
        AGL.Const.ARRAY_BUFFER,
        new Float32Array([
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
      ? "vec4 lgVal(mat4 lg,vec2 pxp,bool hTex){" +
          "vec2 a=vGlPos*lg[1].xw+vGlPos.yx*lg[1].zy+lg[0].xy;" +
          "vec2 aa=a*a;" +
          "float dstA=aa.x+aa.y;" +
          "if(dstA>1.)return vec4(0,0,0,1);" +
          "vec3 rgb=lg[2].rgb;" +
          "if(hTex){" +
            "float c=0.;" +
            "vec2 b=(((lg[0].xy*vec2(-1,1))/lg[1].xw)+1.)/2.;" +
            "float dst=distance(vTexCrd,b);" +
            "vec2 m=(vTexCrd-b)/dst;" +
            "vec2 p;" +
            "vec2 pr=vec2(-1);" +
            "vec2 s;" +
            "vec2 sp;" +
            "for(float i=0.;i<dst;i+=.005){" +
              "s=i*m;" +
              "sp=floor(s/pxp)*pxp;" +
              "if(sp==pr)continue;" +
              "pr=sp;" +
              "p=b+sp;" +
              "if(p.x>=0.&&p.y>=0.&&p.x<=1.&&p.y<=1.){;" +
                "c+=texture(uTex,p).a;" +
                "if(c>=1.)return vec4(0,0,0,1);" +
              "}" +
            "}" +
            "rgb*=1.-c;" +
          "}" +
          "return vec4(rgb*(clamp((1.-sqrt(dstA))*lg[3].x,0.,1.)*lg[3].y),lg[2].a*lg[3].y);" +
        "}"
      : ""
  ) +

  "void main(void){" +
    "vec2 pxp=1./vec2(textureSize(uTex,0));" +
    "bool hTex=pxp.x<1.&&pxp.y<1.;" +
    "fgCol=vec4(0);";

    if (config.isLightEnabled) {
      for (var i = 0; i < maxLightSources; ++i) {
        shader +=
        "if(uLg[" + i + "][0].w>0.)fgCol+=lgVal(uLg[" + i + "],pxp,hTex);";
      }
    }

    shader +=
    "fgCol=clamp(fgCol,0.,1.);" +
    "float colDst=(fgCol.r+fgCol.g+fgCol.b)/3.;" +
    "fgCol.a=(1.-colDst)+(colDst/2.);" +
  "}";

  return shader;
};
