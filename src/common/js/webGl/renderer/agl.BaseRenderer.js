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

    this.clearColor = new AGL.ColorProps();

    helpers.constant(this, "_MAX_BATCH_ITEMS", 10000);

    this._clearBeforeRender     = true;
    this._clearBeforeRenderFunc = this.clear.bind(this);

    this._currentBlendMode = AGL.BlendModes.NORMAL;

    this._batchItems = 0;

    this._textureMap = [];
    this._textureIds = [];

    this._textureIdBufferUpdated = false;

    AGL.RendererHelper.init.call(this, config);

    this._drawFunctionMap = {};
    this._drawFunctionMap[AGL.Item.TYPE]      = helpers.emptyFunction;
    this._drawFunctionMap[AGL.Image.TYPE]     = this._drawImage.bind(this);
    this._drawFunctionMap[AGL.Container.TYPE] = this._drawContainer.bind(this);

    this._update      =
    this._updateProps = helpers.emptyFunction;

    this._resize();
  },
  function(_super) {
    AGL.RendererHelper.createFunctionality.call(this);

    helpers.property(this, "clearBeforeRender", {
      get: function() { return this._clearBeforeRender; },
      set: function(v) {
        this._clearBeforeRender     = v;
        this._clearBeforeRenderFunc = v
          ? this.clear.bind(this)
          : helpers.emptyFunction;
      }
    });

    helpers.get(this, "stage",  function() { return this; });

    this.clear = function() {
      var clearColor = this.clearColor;
      clearColor.isUpdated() && this._gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
      this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }

    this.destruct = function() {
      this._destructRenderer();
      _super.destruct.call(this);
    }

    this._render = function() {
      this._clearBeforeRenderFunc();
      this._drawContainer(this);
      this._batchItems > 0 && this._batchDraw();
    }

    this._drawItem = function(item, parent) {
      if (!item.renderable) return;
      item.update(this._renderTime, parent);
      item.type !== AGL.Item.TYPE && this._drawFunctionMap[item.type](item, parent);
    }

    this._drawContainer = function(container) {
      var children = container.children;
      var i;
      var l;
      for (i = 0, l = children.length; i < l; ++i) this._drawItem(children[i], container);
    }

    this._checkBlendMode = function(item) {
      if (this._currentBlendMode !== item.blendMode) {
        this._batchDraw();
        this._currentBlendMode = item.blendMode;
        this._setBlendMode();
      }
    }

    this._setBufferData = function(item, parent, textureMapIndex, matId, quadId) {
      helpers.arraySet(this._worldMatrixData,   parent.matrixCache,      matId);
      helpers.arraySet(this._matrixData,        item.matrixCache,        matId);
      helpers.arraySet(this._textureMatrixData, item.textureMatrixCache, matId);
      helpers.arraySet(this._textureCropData,   item.textureCropCache,   quadId);
    }

    this._drawImage = function(item, parent) {
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

    this._createArrayBuffer = function(data, locationId, length, num, size, type, bytes) {
      var buffer = this._gl.createBuffer();
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
  		this._gl.bufferData(this._gl.ARRAY_BUFFER, data.byteLength, this._gl.DYNAMIC_DRAW);

      this._attachArrayBuffer(this._locations[locationId], buffer, data, length, num, size, type, bytes);

      return buffer;
    }

    this._attachArrayBuffer = function(location, buffer, data, length, num, size, type, bytes) {
      this._bindArrayBuffer(buffer, data);

  		var stride = bytes * length;
      var i = num + 1;
      while (--i) {
  			var loc = location + (num - i);
  			this._gl.enableVertexAttribArray(loc);

        this._gl[
          "vertexAttrib" + (
            type === this._gl.FLOAT
            ? ""
            : "I"
          ) + "Pointer"
        ](loc, size, type, false, stride, (num - i) * bytes * size);
  			this._gl.vertexAttribDivisor(loc, 1);
  		}
  	}

    this._bindArrayBuffer = function(buffer, data) {
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
  		this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, data);
    }

    this._bindBuffers = function() {
      this._bindArrayBuffer(this._matrixBuffer,        this._matrixData);
      this._bindArrayBuffer(this._worldMatrixBuffer,   this._worldMatrixData);
      this._bindArrayBuffer(this._textureMatrixBuffer, this._textureMatrixData);
      this._bindArrayBuffer(this._textureCropBuffer,   this._textureCropData);
    }

    this._batchDraw = function() {
      if (this._textureIdBufferUpdated) {
        this._textureIdBufferUpdated = false;
        var textureIdBuffer = new Uint16Array(this._textureIds);
        this._gl.uniform1iv(this._locations["uTex"], textureIdBuffer);
      }

      this._bindBuffers();

      this._gl.drawElementsInstanced(this._gl.TRIANGLE_FAN, 6, this._gl.UNSIGNED_SHORT, 0, this._batchItems);

      this._batchItems = 0;
    }

    this._drawTexture = function(textureInfo) {
      if (!textureInfo.loaded) return 0;
      var textureMapIndex = this._textureMap.indexOf(textureInfo);
      if (textureMapIndex === -1 || textureInfo.autoUpdate(this._renderTime)) {
        if (textureMapIndex === -1) {
          if (this._textureMap.length === this._config.textureNum) {
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

      return textureMapIndex + 1;
    }

    this._setBlendMode = function() {
      this._gl[this._currentBlendMode.funcName](
        this._gl[this._currentBlendMode.funcs[0]],
        this._gl[this._currentBlendMode.funcs[1]],
        this._gl[this._currentBlendMode.funcs[2]],
        this._gl[this._currentBlendMode.funcs[3]]
      );
    }

    this._resize = function() {
      if (!this._resizeCanvas()) return false;

      AGL.Matrix3.projection(this._width, this._height, this.matrixCache);

      this.worldPropsUpdateId++;

      return true;
    }

    this._initCustom = function() {
      this._setBlendMode();

      var indexBuffer = this._gl.createBuffer();
      this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      this._gl.bufferData(
        this._gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([
          0, 1, 2,
          0, 2, 3
        ]),
        this._gl.STATIC_DRAW
      );

      this._matrixData          = new Float32Array(this._MAX_BATCH_ITEMS * 9);
  		this._matrixBuffer        = this._createArrayBuffer(this._matrixData,        "aMat",      9, 3, 3, this._gl.FLOAT, 4);
      this._worldMatrixData     = new Float32Array(this._MAX_BATCH_ITEMS * 9);
  		this._worldMatrixBuffer   = this._createArrayBuffer(this._matrixData,        "aWorldMat", 9, 3, 3, this._gl.FLOAT, 4);
      this._textureMatrixData   = new Float32Array(this._MAX_BATCH_ITEMS * 9);
      this._textureMatrixBuffer = this._createArrayBuffer(this._textureMatrixData, "aTexMat",   9, 3, 3, this._gl.FLOAT, 4);
      this._textureCropData     = new Float32Array(this._MAX_BATCH_ITEMS * 4);
      this._textureCropBuffer   = this._createArrayBuffer(this._textureCropData,   "aTexCrop",  4, 1, 4, this._gl.FLOAT, 4);
    }
  }
);
AGL.BaseRenderer.createVertexShader = function() {
  return "#version 300 es\n" +
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
AGL.BaseRenderer.createFragmentShader = function() {
  return "#version 300 es\n" +
  "precision lowp float;" +

  "in vec2 vTexCrd;" +
  "in vec2 vTexCrop;" +
  "in vec2 vTexCropSize;" +

  "out vec4 fgCol;" +

  "void main(void){" +
    "fgCol=vec4(1);" +
  "}";
};
