require("../NameSpace.js");
require("../data/agl.BlendModes.js");
require("../display/agl.Item.js");
require("../display/agl.Container.js");
require("../display/agl.Image.js");
require("../utils/agl.Utils.js");
require("../utils/agl.Matrix3.js");
require("./agl.RendererHelper.js");

AGL.BaseRenderer = helpers.createPrototypeClass(
  AGL.Container,
  function BaseRenderer(config) {
    AGL.Container.call(this);

    config.vertexShader   = config.vertexShader   || AGL.BaseRenderer.createVertexShader;
    config.fragmentShader = config.fragmentShader || AGL.BaseRenderer.createFragmentShader;
    config.locations      = Object.assign(config.locations, {
      "aPos"      : "getAttribLocation",
      "aMat"      : "getAttribLocation",
      "aWorldMat" : "getAttribLocation",
      "aTexMat"   : "getAttribLocation",
      "aTexCrop"  : "getAttribLocation",
      "uTex"      : "getUniformLocation",
    });

    this._MAX_BATCH_ITEMS = config.maxBatchItems;

    this._clearBeforeRender     = true;
    this._clearBeforeRenderFunc = this.clear.bind(this);

    this._currentBlendMode = AGL.BlendModes.NORMAL;

    this._batchItems = 0;

    this._textureMap = [];
    this._textureIds = [];

    this._textureIdBufferUpdated = false;

    AGL.RendererHelper.initRenderer.call(this, config);

    this._drawFunctionMap = {};
    this._drawFunctionMap[AGL.Item.TYPE]      = helpers.emptyFunction;
    this._drawFunctionMap[AGL.Image.TYPE]     = this._drawImage.bind(this);
    this._drawFunctionMap[AGL.Container.TYPE] = this._drawContainer.bind(this);

    this._update      =
    this._updateProps = helpers.emptyFunction;

    this._resize();
  },
  function(_scope, _super) {
    AGL.RendererHelper.createRendererBody.call(_scope, _scope);

    helpers.property(_scope, "clearBeforeRender", {
      get: function() { return this._clearBeforeRender; },
      set: function(v) {
        this._clearBeforeRender     = v;
        this._clearBeforeRenderFunc = v
          ? this.clear.bind(this)
          : helpers.emptyFunction;
      }
    });

    helpers.get(_scope, "stage",  function() { return this; });

    _scope.destruct = function() {
      this._matrixData                          =
  		this._matrixBuffer                        =
      this._worldMatrixData                     =
  		this._worldMatrixBuffer                   =
      this._textureMatrixData                   =
      this._textureMatrixBuffer                 =
      this._textureCropData                     =
      this._textureCropBuffer                   =
      this._clearBeforeRenderFunc               =
      this._currentBlendMode                    =
      this._textureMap                          =
      this._textureIds                          =
      this._drawFunctionMap[AGL.Item.TYPE]      =
      this._drawFunctionMap[AGL.Image.TYPE]     =
      this._drawFunctionMap[AGL.Container.TYPE] =
      this._drawFunctionMap                     = null;

      this._destructRenderer();

      _super.destruct.call(this);
    }

    _scope._render = function() {
      this._clearBeforeRenderFunc();
      this._drawContainer(this);
      this._batchItems > 0 && this._batchDraw();
    }

    _scope._drawItem = function(item, parent) {
      if (!item.renderable) return;
      item.update(this._renderTime, parent);
      item.type !== AGL.Item.TYPE && this._drawFunctionMap[item.type](item, parent);
    }

    _scope._drawContainer = function(container) {
      var children = container.children;
      var i;
      var l;
      for (i = 0, l = children.length; i < l; ++i) this._drawItem(children[i], container);
    }

    _scope._checkBlendMode = function(item) {
      if (this._currentBlendMode !== item.blendMode) {
        this._batchDraw();
        this._currentBlendMode = item.blendMode;
        this._setBlendMode();
      }
    }

    _scope._setBufferData = function(item, parent, textureMapIndex, matId, quadId) {
      helpers.arraySet(this._worldMatrixData,   parent.matrixCache,      matId);
      helpers.arraySet(this._matrixData,        item.matrixCache,        matId);
      helpers.arraySet(this._textureMatrixData, item.textureMatrixCache, matId);
      helpers.arraySet(this._textureCropData,   item.textureCropCache,   quadId);
    }

    _scope._drawImage = function(item, parent) {
      this._checkBlendMode(item);

      var textureMapIndex = this._drawTexture(item.texture);

      this._setBufferData(
        item,
        parent,
        textureMapIndex,
        this._batchItems * 9,
        this._batchItems * 4
      );

      ++this._batchItems === this._MAX_BATCH_ITEMS && this._batchDraw();
    }

    _scope._createArrayBuffer = function(data, locationId, length, num, size, type, bytes) {
      var buffer = this._gl.createBuffer();
      this._gl.bindBuffer(AGL.Consts.ARRAY_BUFFER, buffer);
  		this._gl.bufferData(AGL.Consts.ARRAY_BUFFER, data.byteLength, AGL.Consts.DYNAMIC_DRAW);

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
            type === AGL.Consts.FLOAT
            ? ""
            : "I"
          ) + "Pointer"
        ](loc, size, type, false, stride, (num - i) * bytes * size);
  			this._gl.vertexAttribDivisor(loc, 1);
  		}
  	}

    _scope._bindArrayBuffer = function(buffer, data) {
      this._gl.bindBuffer(AGL.Consts.ARRAY_BUFFER, buffer);
  		this._gl.bufferSubData(AGL.Consts.ARRAY_BUFFER, 0, data);
    }

    _scope._bindBuffers = function() {
      this._bindArrayBuffer(this._matrixBuffer,        this._matrixData);
      this._bindArrayBuffer(this._worldMatrixBuffer,   this._worldMatrixData);
      this._bindArrayBuffer(this._textureMatrixBuffer, this._textureMatrixData);
      this._bindArrayBuffer(this._textureCropBuffer,   this._textureCropData);
    }

    _scope._batchDraw = function() {
      if (this._textureIdBufferUpdated) {
        this._textureIdBufferUpdated = false;
        var textureIdBuffer = new Uint16Array(this._textureIds);
        this._gl.uniform1iv(this._locations["uTex"], textureIdBuffer);
      }

      this._bindBuffers();

      this._gl.drawElementsInstanced(AGL.Consts.TRIANGLE_FAN, 6, AGL.Consts.UNSIGNED_SHORT, 0, this._batchItems);

      this._batchItems = 0;
    }

    _scope._drawTexture = function(textureInfo, isMask) {
      if (!textureInfo.loaded) return -1;
      var textureMapIndex = this._textureMap.indexOf(textureInfo);
      if (textureMapIndex === -1 || textureInfo.autoUpdate(this._renderTime)) {
        if (textureMapIndex === -1) {
          if (this._textureMap.length === this._config.textureNum - (isMask ? 1 : 0)) {
            this._batchDraw();
            this._textureIds.length =
            this._textureMap.length = 0;
          }
          this._textureMap.push(textureInfo);
          textureMapIndex = this._textureMap.length - 1;
          this._textureIds.push(textureMapIndex);
          this._textureIdBufferUpdated = true;
        }

        AGL.Utils.useTexture(this._gl, textureMapIndex, textureInfo);
      }

      return textureMapIndex;
    }

    _scope._setBlendMode = function() {
      this._gl[this._currentBlendMode.funcName](
        this._currentBlendMode.funcs[0],
        this._currentBlendMode.funcs[1],
        this._currentBlendMode.funcs[2],
        this._currentBlendMode.funcs[3]
      );
    }

    _scope._resize = function() {
      if (!this._resizeCanvas()) return false;

      AGL.Matrix3.projection(this._width, this._height, this.matrixCache);

      this.worldPropsUpdateId++;

      return true;
    }

    _scope._initCustom = function() {
      this._setBlendMode();

      var indexBuffer = this._gl.createBuffer();
      this._gl.bindBuffer(AGL.Consts.ELEMENT_ARRAY_BUFFER, indexBuffer);
      this._gl.bufferData(
        AGL.Consts.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([
          0, 1, 2,
          0, 2, 3
        ]),
        AGL.Consts.STATIC_DRAW
      );

      this._matrixData          = new Float32Array(this._MAX_BATCH_ITEMS * 9);
  		this._matrixBuffer        = this._createArrayBuffer(this._matrixData,        "aMat",      9, 3, 3, AGL.Consts.FLOAT, 4);
      this._worldMatrixData     = new Float32Array(this._MAX_BATCH_ITEMS * 9);
  		this._worldMatrixBuffer   = this._createArrayBuffer(this._matrixData,        "aWorldMat", 9, 3, 3, AGL.Consts.FLOAT, 4);
      this._textureMatrixData   = new Float32Array(this._MAX_BATCH_ITEMS * 9);
      this._textureMatrixBuffer = this._createArrayBuffer(this._textureMatrixData, "aTexMat",   9, 3, 3, AGL.Consts.FLOAT, 4);
      this._textureCropData     = new Float32Array(this._MAX_BATCH_ITEMS * 4);
      this._textureCropBuffer   = this._createArrayBuffer(this._textureCropData,   "aTexCrop",  4, 1, 4, AGL.Consts.FLOAT, 4);
    }
  }
);
AGL.BaseRenderer.createVertexShader = function() {
  return
  "#version 300 es\n" +

  "in vec2 aPos;" +
  "in mat3 aMat;" +
  "in mat3 aWorldMat;" +
  "in mat3 aTexMat;" +
  "in vec4 aTexCrop;" +

  "out vec2 vTexCrd;" +
  "out vec2 vTexCrop;" +
  "out vec2 vTexCropSize;" +

  "void main(void){" +
    "vec3 pos=vec3(aPos,1);" +
    "gl_Position=vec4((aWorldMat*aMat*pos).xy,0,1);" +
    "vTexCrd=(aTexMat*pos).xy;" +
    "vTexCrop=aTexCrop.xy;" +
    "vTexCropSize=aTexCrop.zw;" +
  "}";
};
AGL.BaseRenderer.createFragmentShader = function(config) {
  return
  "#version 300 es\n" +
  "precision " + config.precision + " float;" +

  "in vec2 vTexCrd;" +
  "in vec2 vTexCrop;" +
  "in vec2 vTexCropSize;" +

  "out vec4 fgCol;" +

  "void main(void){" +
    "fgCol=vec4(1);" +
  "}";
};
