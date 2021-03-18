require("../NameSpace.js");
require("../data/agl.BlendMode.js");
require("../display/agl.Item.js");
require("../display/agl.Container.js");
require("../display/agl.StageContainer.js");
require("../display/agl.Image.js");
require("../utils/agl.Utils.js");
require("../geom/agl.Matrix3.js");
require("./agl.BaseRenderer.js");

AGL.BaseBatchRenderer = helpers.createPrototypeClass(
  AGL.BaseRenderer,
  function BaseBatchRenderer(options) {
    this._container = new AGL.StageContainer(this);

    this._MAX_BATCH_ITEMS = Math.max(1, options.maxBatchItems || 1e4);

    this._batchItems = 0;

    AGL.BaseRenderer.call(this, options.config);

    this._drawFunctionMap = {};
    this._drawFunctionMap[AGL.Item.TYPE]      = helpers.emptyFunction;
    this._drawFunctionMap[AGL.Image.TYPE]     = this._drawImage.bind(this);
    this._drawFunctionMap[AGL.Container.TYPE] = this._drawContainer.bind(this);

    this._batchDrawBound = this._batchDraw.bind(this);
  },
  function(_scope, _super) {
    helpers.get(_scope, "container", function() { return this._container; });

    _scope._render = function() {
      this._drawItem(this._container);
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

    _scope._drawImage = function(item) {
      this._context.setBlendMode(item.blendMode, this._batchDrawBound);

      this._drawImageCustomSettings(item);

      var matId  = this._batchItems * 16;

      helpers.arraySet(this._matrixBuffer.data, item.matrixCache,        matId);
      helpers.arraySet(this._matrixBuffer.data, item.textureMatrixCache, matId + 6);
      helpers.arraySet(this._matrixBuffer.data, item.textureCropCache,   matId + 12);

      ++this._batchItems === this._MAX_BATCH_ITEMS && this._batchDraw();
    }

    _scope._drawImageCustomSettings = helpers.emptyFunction;

    _scope._batchDraw = function() {
      if (this._batchItems > 0) {
        this._uploadBuffers();

        this._gl.uniform1iv(this._locations.uTex, this._context.textureIds);

        this._drawInstanced(this._batchItems);

        this._batchItems = 0;
      }
    }

    _scope._resize = function() {
      var isResized = _super._resize.call(this);
      if (isResized) {
        AGL.Matrix3.projection(this._width, this._height, this._container.parent.matrixCache);
        ++this._container.parent.propsUpdateId;
      }
      return isResized;
    }
  }
);
