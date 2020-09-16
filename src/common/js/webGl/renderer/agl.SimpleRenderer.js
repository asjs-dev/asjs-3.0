require("../NameSpace.js");
require("./agl.BaseRenderer.js");

AGL.SimpleRenderer = createPrototypeClass(
  AGL.BaseRenderer,
  function SimpleRenderer(config) {
    config.vertexShader   = config.vertexShader   || AGL.SimpleRenderer.createVertexShader;
    config.fragmentShader = config.fragmentShader || AGL.SimpleRenderer.createFragmentShader;
    config.locations      = Object.assign(config.locations, {
      "aTexId" : "getAttribLocation",
    });

    AGL.BaseRenderer.call(this, config);

    this._texIdDat = new Float32Array(this._MAX_BATCH_ITEMS);
    this._texIdBuf = this._createArBuf(this._texIdDat, "aTexId", 1, 1, 1, this._gl.FLOAT, 4);
  },
  function(_super) {
    this._setBufDat = function(item, parent, textureMapIndex, matId, quadId) {
      _super._setBufDat.call(this, item, parent, textureMapIndex, matId, quadId);
      this._texIdDat[this._batchItems] = textureMapIndex;
    }

    this._bindBufs = function() {
      _super._bindBufs.call(this);
      this._bindArBuf(this._texIdBuf, this._texIdDat);
    }
  }
);
AGL.SimpleRenderer.createVertexShader = function() {
  var shader = "#version 300 es\n" +

  "in vec2 aPos;" +
  "in mat3 aMat;" +
  "in mat3 aWorldMat;" +
  "in mat3 aTexMat;" +
  "in vec4 aTexCrop;" +
  "in float aTexId;" +

  "out vec2 vTexCrd;" +
  "out vec2 vTexCrop;" +
  "out vec2 vTexCropSize;" +
  "out float vTexId;" +

  "void main(void){" +
    "vec3 pos=vec3(aPos,1);" +
    "gl_Position=vec4((aWorldMat*aMat*pos).xy,0,1);" +
    "vTexCrd=(aTexMat*pos).xy;" +
    "vTexCrop=aTexCrop.xy;" +
    "vTexCropSize=aTexCrop.zw;" +
    "vTexId=aTexId;" +
  "}";

  return shader;
};
AGL.SimpleRenderer.createFragmentShader = function(config) {
  var maxTextureImageUnits = config.textureNum;

  var shader = "#version 300 es\n" +
  "precision lowp float;" +

  "in vec2 vTexCrd;" +
  "in vec2 vTexCrop;" +
  "in vec2 vTexCropSize;" +
  "in float vTexId;" +

  "uniform sampler2D uTex[" + maxTextureImageUnits + "];" +

  "out vec4 fgCol;";

  shader +=
  "void main(void){";

    for (var i = -1; i < maxTextureImageUnits; i++) {
      shader += (i > -1 ? " else " : "") +
      "if(vTexId<" + (i + 1) + ".5){";
        shader += "fgCol=" + (
          i < 0
            ? "vec4(0);"
            : "texture(uTex[" + i + "],vTexCrop+vTexCropSize*fract(vTexCrd));"
        );
      shader +=
      "}";
    }

    shader +=
  "}";

  return shader;
};
