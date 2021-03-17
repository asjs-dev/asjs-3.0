require("../NameSpace.js");
require("./agl.BaseBatchRenderer.js");

AGL.SimpleRenderer = helpers.createPrototypeClass(
  AGL.BaseBatchRenderer,
  function SimpleRenderer(options) {
    options                  = options || {};
    options.config           = AGL.Utils.initRendererConfig(options.config, AGL.SimpleRenderer);
    options.config.locations = options.config.locations.concat([
      "aTexId"
    ]);

    AGL.BaseBatchRenderer.call(this, options);

    this._textureIdBuffer = new AGL.Buffer(
      new F32A(this._MAX_BATCH_ITEMS),
      "aTexId", 1, 1, 1
    );
  },
  function(_scope, _super) {
    _scope._drawImageCustomSettings = function(item) {
      this._textureIdBuffer.data[this._batchItems] = this._context.useTexture(
        item.texture,
        this._renderTime,
        false,
        0,
        this._batchDrawBound
      );
    }

    _scope._uploadBuffers = function() {
      this._textureIdBuffer.upload(this._gl, this._enableBuffers, this._locations);
      _super._uploadBuffers.call(this);
    }

    _scope._createBuffers = function() {
      _super._createBuffers.call(this);
      this._textureIdBuffer.create(this._gl);
    }

    _scope._createVertexShader = function(config) {
      return AGL.Utils.createVersion(config.precision) +

      "in vec2 aPos;" +
      "in mat4 aMt;" +
      "in float aTexId;" +

      "uniform float uFlpY;" +

      "out vec2 vTCrd;" +
      "out vec4 vTexCrop;" +
      "out float vTexId;" +

      "void main(void){" +
        AGL.Utils.calcGlPositions +
        "vTexId=aTexId;" +
      "}";
    };

    _scope._createFragmentShader = function(config) {
      var maxTextureImageUnits = AGL.Utils.info.maxTextureImageUnits;

      return AGL.Utils.createVersion(config.precision) +

      "in vec2 vTCrd;" +
      "in vec4 vTexCrop;" +
      "in float vTexId;" +

      "uniform sampler2D uTex[" + maxTextureImageUnits + "];" +

      "out vec4 fgCol;" +

      AGL.Utils.createGetTextureFunction(maxTextureImageUnits) +

      "void main(void){" +
        AGL.Utils.getTexColor +
      "}";
    };
  }
);
