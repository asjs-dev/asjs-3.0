require("../NameSpace.js");
require("../data/agl.BlendMode.js");
require("../display/agl.Item.js");
require("../display/agl.Container.js");
require("../display/agl.Image.js");
require("../utils/agl.Utils.js");
require("../geom/agl.Matrix3.js");
require("./agl.RendererHelper.js");

AGL.BatchRendererBase = helpers.createPrototypeClass(
  AGL.Container,
  function BatchRendererBase(options) {
    AGL.Container.call(this);

    //this._currentBlendMode;

    options.config.locations = options.config.locations.concat([
      "aMt"
    ]);

    this._maxBatchItems = Math.max(1, options.maxBatchItems || 1e4);

    this._clearBeforeRenderFunc = helpers.emptyFunction;

    this._batchItems = 0;

    this._TEXTURE_NUM = AGL.Utils.info.maxTextureImageUnits;

    this._textureMap = [];

    AGL.RendererHelper.constructor.call(this, options.config);

    this._drawFunctionMap = {};
    this._drawFunctionMap[AGL.Item.TYPE]      = helpers.emptyFunction;
    this._drawFunctionMap[AGL.Image.TYPE]     = this._drawImage.bind(this);
    this._drawFunctionMap[AGL.Container.TYPE] = this._drawContainer.bind(this);

    this._parent = new AGL.BaseItem();
  },
  function(_scope, _super) {
    AGL.RendererHelper.body.call(_scope, _scope);

    helpers.get(_scope, "stage",  function() { return this; });
    helpers.get(_scope, "parent", function() { return this._parent; });

    helpers.property(_scope, "clearBeforeRender", {
      get: function() { return this._clearBeforeRenderFunc === this.clear; },
      set: function(v) {
        this._clearBeforeRenderFunc = v
          ? this.clear
          : helpers.emptyFunction;
      }
    });

    _scope.destruct = function() {
      this._destructRenderer();

      _super.destruct.call(this);
    }

    _scope._render = function() {
      this._clearBeforeRenderFunc();
      this._drawItem(this);
      this._batchDraw();
    }

    _scope._drawItem = function(item) {
      item.update(this._renderTime);
      item.callback(item, this._renderTime);
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

      ++this._batchItems === this._maxBatchItems && this._batchDraw();
    }

    _scope._bindBuffers = function() {
      this._bindArrayBuffer(this._matrixBuffer, this._matrixData);
    }

    _scope._batchDraw = function() {
      if (this._batchItems > 0) {
        this._bindBuffers();

        this._gl.drawElementsInstanced({{AGL.Const.TRIANGLE_FAN}}, 6, {{AGL.Const.UNSIGNED_SHORT}}, 0, this._batchItems);

        this._batchItems = 0;
      }
    }

    _scope._drawTexture = function(textureInfo, isMask) {
      if (textureInfo) {
        var textureIndex = this._textureMap.indexOf(textureInfo);
        var isTextureNotMapped = textureIndex < 0;
        if (textureInfo.isNeedToDraw(this._gl, this._renderTime) || isTextureNotMapped) {
          if (isTextureNotMapped) {
            if (this._textureMap.length === this._TEXTURE_NUM - isMask) {
              this._batchDraw();
              this._textureMap.length = 0;
            }

            this._textureMap.push(textureInfo);
            textureIndex = this._textureMap.length - 1;
          }

          AGL.Utils.useActiveTexture(this._gl, textureInfo, textureIndex);
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

    var _superResize = _scope._resize;
    _scope._resize = function() {
      _superResize.call(this);

      AGL.Matrix3.projection(this._width, this._height, this._parent.matrixCache);
      ++this.parent.propsUpdateId;
    }

    _scope._initCustom = function() {
      this._gl.bindBuffer({{AGL.Const.ELEMENT_ARRAY_BUFFER}}, this._gl.createBuffer());
      this._gl.bufferData(
        {{AGL.Const.ELEMENT_ARRAY_BUFFER}},
        AGL.RendererHelper.pointsOrder,
        {{AGL.Const.STATIC_DRAW}}
      );

      var textureIds = new Uint16Array(this._TEXTURE_NUM);
      var l = this._TEXTURE_NUM;
      for (var i = 0; i < l; ++i) textureIds[i] = i;
      this._gl.uniform1iv(this._locations.uTex, textureIds);

      this._matrixData   = new F32A(this._maxBatchItems * 16);
  		this._matrixBuffer = this._createArrayBuffer(this._matrixData, "aMt", 16, 4, 4, {{AGL.Const.FLOAT}}, 4);
    }
  }
);
