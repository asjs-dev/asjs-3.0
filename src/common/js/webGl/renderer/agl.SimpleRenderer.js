require("../NameSpace.js");
require("./agl.BaseRenderer.js");

AGL.SimpleRenderer = helpers.createPrototypeClass(
  AGL.BaseRenderer,
  function SimpleRenderer(config) {
    config = AGL.RendererHelper.initConfig(config, AGL.SimpleRenderer);

    config.locations = config.locations.concat([
      "aTexId"
    ]);

    AGL.BaseRenderer.call(this, config);
  },
  function(_scope, _super) {
    _scope._setBufferData = function(item, textureMapIndex) {
      _super._setBufferData.call(this, item, textureMapIndex);
      this._textureIdData[this._batchItems] = textureMapIndex;
    }

    _scope._bindBuffers = function() {
      _super._bindBuffers.call(this);
      this._bindArrayBuffer(this._textureIdBuffer, this._textureIdData);
    }

    _scope._initCustom = function() {
      _super._initCustom.call(this);

      this._textureIdData   = new Float32Array(this._MAX_BATCH_ITEMS);
      this._textureIdBuffer = this._createArrayBuffer(this._textureIdData, "aTexId", 1, 1, 1, AGLC.FLOAT, 4);
    }
  }
);
AGL.SimpleRenderer.createVertexShader = function(config) {
  return AGL.RendererHelper.createVersion(config.precision) +

  "in vec2 aPos;" +
  "in mat4 aMt;" +
  "in float aTexId;" +

  "out vec2 vTCrd;" +
  "out vec4 vTexCrop;" +
  "out float vTexId;" +

  "void main(void){" +
    AGL.RendererHelper.calcGlPositions +
    "vTexId=aTexId;" +
  "}";
};
AGL.SimpleRenderer.createFragmentShader = function(config) {
  var maxTextureImageUnits = AGL.Utils.info.maxTextureImageUnits;

  return AGL.RendererHelper.createVersion(config.precision) +

  "in vec2 vTCrd;" +
  "in vec4 vTexCrop;" +
  "in float vTexId;" +

  "uniform sampler2D uTex[" + maxTextureImageUnits + "];" +

  "out vec4 fgCol;" +

  AGL.RendererHelper.createGetTextureFunction(maxTextureImageUnits) +

  "void main(void){" +
    AGL.RendererHelper.getTexColor +
  "}";
};
