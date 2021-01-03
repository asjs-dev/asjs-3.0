require("../NameSpace.js");
require("../data/agl.BlendMode.js");
require("../display/agl.Item.js");
require("../display/agl.Container.js");
require("../display/agl.Image.js");
require("../utils/agl.Utils.js");
require("../geom/agl.Matrix3.js");
require("./agl.RendererHelper.js");

AGL.BaseRenderer = helpers.createPrototypeClass(
  AGL.Container,
  function BaseRenderer(config) {
    AGL.Container.call(this);

    config = AGL.RendererHelper.initConfig(config, AGL.BaseRenderer);

    config.locations = config.locations.concat([
      "aMt"
    ]);

    this._MAX_BATCH_ITEMS = config.maxBatchItems;

    this._clearBound = this.clear.bind(this);
    this._clearBeforeRenderFunc = helpers.emptyFunction;

    this._currentBlendMode;

    this._batchItems = 0;

    this._textureNum = AGL.Utils.info.maxTextureImageUnits;
    this._textureMap = [];

    AGL.RendererHelper.initRenderer.call(this, config);

    this._drawFunctionMap = {};
    this._drawFunctionMap[AGL.Item.TYPE]      = helpers.emptyFunction;
    this._drawFunctionMap[AGL.Image.TYPE]     = this._drawImage.bind(this);
    this._drawFunctionMap[AGL.Container.TYPE] = this._drawContainer.bind(this);

    this._parent = new AGL.BaseItem();

    this._resize();
  },
  function(_scope, _super) {
    AGL.RendererHelper.createRendererBody.call(_scope, _scope);

    helpers.property(_scope, "parent", {
      get: function() { return this._parent; },
      set: function(v) {}
    });

    helpers.property(_scope, "clearBeforeRender", {
      get: function() { return this._clearBeforeRenderFunc === this._clearBound; },
      set: function(v) {
        this._clearBeforeRenderFunc = v
          ? this._clearBound
          : helpers.emptyFunction;
      }
    });

    helpers.get(_scope, "stage",  function() { return this; });

    _scope.destruct = function() {
      this._destructRenderer();

      _super.destruct.call(this);
    }

    _scope._render = function() {
      this._clearBeforeRenderFunc();
      this._drawItem(this);
      this._batchItems > 0 && this._batchDraw();
    }

    _scope._drawItem = function(item) {
      item.update(this._renderTime);
      item.callback && item.callback.call(item, this._renderTime);
      item.renderable && this._drawFunctionMap[item.TYPE](item);
    }

    _scope._drawContainer = function(container) {
      var children = container.children;
      var l = children.length;
      for (var i = 0; i < l; ++i) this._drawItem(children[i]);
    }

    _scope._setBufferData = function(item, textureMapIndex) {
      var matId  = this._batchItems * 16;

      helpers.arraySet(this._matrixData, item.matrixCache,        matId);
      helpers.arraySet(this._matrixData, item.textureMatrixCache, matId + 6);
      helpers.arraySet(this._matrixData, item.textureCropCache,   matId + 12);
    }

    _scope._drawImage = function(item) {
      this._setBlendMode(item.blendMode);

      var textureMapIndex = this._drawTexture(item.texture, false);

      this._setBufferData(item, textureMapIndex);

      ++this._batchItems === this._MAX_BATCH_ITEMS && this._batchDraw();
    }

    _scope._bindBuffers = function() {
      this._bindArrayBuffer(this._matrixBuffer, this._matrixData);
    }

    _scope._batchDraw = function() {
      if (this._batchItems > 0) {
        this._bindBuffers();

        this._gl.drawElementsInstanced(AGL.Const.TRIANGLE_FAN, 6, AGL.Const.UNSIGNED_SHORT, 0, this._batchItems);

        this._batchItems = 0;

        this._gl.flush();
      }
    }

    _scope._drawTexture = function(textureInfo, isMask) {
      if (textureInfo) {
        var textureIndex = this._textureMap.indexOf(textureInfo);
        var isTextureNotMapped = textureIndex < 0;
        if (isTextureNotMapped || textureInfo.isNeedToDraw(this._gl, this._renderTime)) {
          if (isTextureNotMapped) {
            if (this._textureMap.length === this._textureNum - isMask) {
              this._batchDraw();
              this._textureMap.length = 0;
            }

            this._textureMap.push(textureInfo);
            textureIndex = this._textureMap.length - 1;
          }

          AGL.Utils.useTexture(this._gl, textureIndex, textureInfo);
        }

        return textureIndex;
      }

      return -1;
    }

    _scope._setBlendMode = function(blendMode) {
      if (this._currentBlendMode !== blendMode) {
        this._currentBlendMode = blendMode;
        this._batchDraw();
        this._useBlendMode(blendMode);
      }
    }

    _scope._resize = function() {
      if (this._resizeCanvas()) {
        AGL.Matrix3.projection(this._width, this._height, this._parent.matrixCache);
        ++this.parent.propsUpdateId;
      }
    }

    _scope._initCustom = function() {
      this._gl.bindBuffer(AGL.Const.ELEMENT_ARRAY_BUFFER, this._gl.createBuffer());
      this._gl.bufferData(
        AGL.Const.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([
          0, 1, 2,
          0, 2, 3
        ]),
        AGL.Const.STATIC_DRAW
      );

      var textureIds = new Uint16Array(this._textureNum);
      var l = this._textureNum;
      for (var i = 0; i < l; ++i) textureIds[i] = i;
      this._gl.uniform1iv(this._locations.uTex, textureIds);

      this._matrixData   = new Float32Array(this._MAX_BATCH_ITEMS * 16);
  		this._matrixBuffer = this._createArrayBuffer(this._matrixData, "aMt", 16, 4, 4, AGL.Const.FLOAT, 4);
    }
  }
);
AGL.BaseRenderer.createVertexShader = function() {
  return
  "#version 300 es\n" +

  "in vec2 aPos;" +
  "in mat4 aMt;" +

  "out vec2 vTexCrd;" +
  "out vec4 vTexCrop;" +

  "void main(void){" +
    AGL.RendererHelper.calcGlPositions +
  "}";
};
AGL.BaseRenderer.createFragmentShader = function(config) {
  return
  "#version 300 es\n" +
  "precision " + config.precision + " float;" +

  "in vec2 vTexCrd;" +
  "in vec4 vTexCrop;" +

  "out vec4 fgCol;" +

  "void main(void){" +
    "fgCol=vec4(1);" +
  "}";
};
