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

    config.vertexShader   = config.vertexShader   || AGL.BaseRenderer.createVertexShader;
    config.fragmentShader = config.fragmentShader || AGL.BaseRenderer.createFragmentShader;
    config.locations      = config.locations.concat([
      "aPos",
      "aMt",
      "uTex"
    ]);

    this._MAX_BATCH_ITEMS = config.maxBatchItems;

    this._clearBound = this.clear.bind(this);
    this._clearBeforeRenderFunc = this._clearBound;

    this._currentBlendMode;

    this._batchItems = 0;

    this._textureNum = AGL.Utils.info.maxTextureImageUnits;
    this._textureMap = [];

    AGL.RendererHelper.initRenderer.call(this, config);

    this._drawFunctionMap = {};
    this._drawFunctionMap[AGL.Item.TYPE]      = helpers.emptyFunction;
    this._drawFunctionMap[AGL.Image.TYPE]     = this._drawImage.bind(this);
    this._drawFunctionMap[AGL.Container.TYPE] = this._drawContainer.bind(this);

    this.update       =
    this._updateProps = helpers.emptyFunction;

    this._resize();
  },
  function(_scope, _super) {
    AGL.RendererHelper.createRendererBody.call(_scope, _scope);

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
      this._drawContainer(this);
      this._batchItems > 0 && this._batchDraw();
    }

    _scope._drawItem = function(item) {
      item.update(this._renderTime);
      this._drawFunctionMap[item.TYPE](item);
    }

    _scope._drawContainer = function(container) {
      var children = container.children;
      var child;
      var l = container.length;
      for (var i = 0; i < l; ++i) {
        child = children[i];
        child.renderable && this._drawItem(child);
      }
    }

    _scope._setBufferData = function(item, textureMapIndex, matId, quadId) {
      helpers.arraySet(this._matrixData, item.matrixCache,        matId);
      helpers.arraySet(this._matrixData, item.textureMatrixCache, matId + 6);
      helpers.arraySet(this._matrixData, item.textureCropCache,   matId + 12);
    }

    _scope._drawImage = function(item) {
      this._setBlendMode(item.blendMode);

      var textureMapIndex = this._drawTexture(item.texture, false);

      this._setBufferData(
        item,
        textureMapIndex,
        this._batchItems * 16,
        this._batchItems * 4
      );

      ++this._batchItems === this._MAX_BATCH_ITEMS && this._batchDraw();
    }

    _scope._createArrayBuffer = function(data, locationId, length, num, size, type, bytes) {
      var buffer = this._gl.createBuffer();

      this._gl.bindBuffer(AGL.Const.ARRAY_BUFFER, buffer);
  		this._gl.bufferData(AGL.Const.ARRAY_BUFFER, data.byteLength, AGL.Const.DYNAMIC_DRAW);

      this._attachArrayBuffer(this._locations[locationId], buffer, data, length, num, size, type, bytes);

      return buffer;
    }

    _scope._attachArrayBuffer = function(location, buffer, data, length, num, size, type, bytes) {
      this._bindArrayBuffer(buffer, data);

  		var stride = bytes * length;
      var i = num + 1;
      while (--i) {
  			var loc = location + (num - i);
  			this._gl.enableVertexAttribArray(loc);

        this._gl[
          "vertexAttrib" + (
            type === AGL.Const.FLOAT
            ? ""
            : "I"
          ) + "Pointer"
        ](loc, size, type, false, stride, (num - i) * bytes * size);
  			this._gl.vertexAttribDivisor(loc, 1);
  		}
  	}

    _scope._bindArrayBuffer = function(buffer, data) {
      this._gl.bindBuffer(AGL.Const.ARRAY_BUFFER, buffer);
  		this._gl.bufferSubData(AGL.Const.ARRAY_BUFFER, 0, data);
    }

    _scope._bindBuffers = function() {
      this._bindArrayBuffer(this._matrixBuffer, this._matrixData);
    }

    _scope._batchDraw = function() {
      this._bindBuffers();

      this._gl.drawElementsInstanced(AGL.Const.TRIANGLE_FAN, 6, AGL.Const.UNSIGNED_SHORT, 0, this._batchItems);

      this._batchItems = 0;
    }

    _scope._drawTexture = function(textureInfo, isMask) {
      if (textureInfo) {
        var textureMapIndex = this._textureMap.indexOf(textureInfo);
        var isTextureNotMapped = textureMapIndex < 0;
        if (isTextureNotMapped || textureInfo.isNeedToDraw(this._gl, this._renderTime)) {
          if (isTextureNotMapped) {
            if (this._textureMap.length === this._textureNum - isMask) {
              this._batchDraw();
              this._textureMap.length = 0;
            }

            this._textureMap.push(textureInfo);
            textureMapIndex = this._textureMap.length - 1;
          }

          AGL.Utils.useTexture(this._gl, textureMapIndex, textureInfo);
        }

        return textureMapIndex;
      }

      return -1;
    }

    _scope._setBlendMode = function(blendMode) {
      if (this._currentBlendMode !== blendMode) {
        this._currentBlendMode = blendMode;
        this._batchDraw();
        this._gl[blendMode.funcName](
          blendMode.funcs[0],
          blendMode.funcs[1],
          blendMode.funcs[2],
          blendMode.funcs[3]
        );
      }
    }

    _scope._resize = function() {
      if (this._resizeCanvas()) {
        AGL.Matrix3.projection(this._width, this._height, this.matrixCache);
        ++this.propsUpdateId;
      }
    }

    _scope._initCustom = function() {
      var indexBuffer = this._gl.createBuffer();
      this._gl.bindBuffer(AGL.Const.ELEMENT_ARRAY_BUFFER, indexBuffer);
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
