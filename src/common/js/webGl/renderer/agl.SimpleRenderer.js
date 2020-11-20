require("../NameSpace.js");
require("./agl.BaseRenderer.js");

AGL.SimpleRenderer = helpers.createPrototypeClass(
  AGL.BaseRenderer,
  function SimpleRenderer(config) {
    config.vertexShader   = config.vertexShader   || AGL.SimpleRenderer.createVertexShader;
    config.fragmentShader = config.fragmentShader || AGL.SimpleRenderer.createFragmentShader;
    config.locations      = Object.assign(config.locations, {
      "aTexId" : "getAttribLocation",
    });

    AGL.BaseRenderer.call(this, config);
  },
  function(_scope, _super) {
    _scope._setBufferData = function(item, parent, textureMapIndex, matId, quadId) {
      _super._setBufferData.call(this, item, parent, textureMapIndex, matId, quadId);
      this._textureIdData[this._batchItems] = textureMapIndex;
    }

    _scope._bindBuffers = function() {
      _super._bindBuffers.call(this);
      this._bindArrayBuffer(this._textureIdBuffer, this._textureIdData);
    }

    _scope._initCustom = function() {
      _super._initCustom.call(this);

      this._textureIdData   = new Float32Array(this._MAX_BATCH_ITEMS);
      this._textureIdBuffer = this._createArrayBuffer(this._textureIdData, "aTexId", 1, 1, 1, AGL.Const.FLOAT, 4);
    }
  }
);
AGL.SimpleRenderer.createVertexShader = function() {
  return
  "#version 300 es\n" +

  "in vec2 aPos;" +
  "in mat3 aMat;" +
  "in mat3 aTexMat;" +
  "in vec4 aTexCrop;" +
  "in float aTexId;" +

  "out vec2 vTexCrd;" +
  "out vec2 vTexCrop;" +
  "out vec2 vTexCropSize;" +
  "out float vTexId;" +

  "void main(void){" +
    "vec3 pos=vec3(aPos,1);" +
    "gl_Position=vec4((aMat*pos).xy,0,1);" +
    "vTexCrd=(aTexMat*pos).xy;" +
    "vTexCrop=aTexCrop.xy;" +
    "vTexCropSize=aTexCrop.zw;" +
    "vTexId=aTexId;" +
  "}";
};
AGL.SimpleRenderer.createFragmentShader = function(config) {
  var maxTextureImageUnits = AGL.Utils.info.maxTextureImageUnits;

  return
  "#version 300 es\n" +
  "precision " + config.precision + " float;" +

  "in vec2 vTexCrd;" +
  "in vec2 vTexCrop;" +
  "in vec2 vTexCropSize;" +
  "in float vTexId;" +

  "uniform sampler2D uTex[" + maxTextureImageUnits + "];" +

  "out vec4 fgCol;" +

  AGL.RendererHelper.createGetTextureFunction(maxTextureImageUnits) +

  "void main(void){" +
    AGL.RendererHelper.createGetTexColor() +
  "}";
};
