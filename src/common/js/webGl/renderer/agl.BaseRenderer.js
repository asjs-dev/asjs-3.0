require("../NameSpace.js");
require("../data/agl.BlendModes.js");
require("../display/agl.Item.js");
require("../display/agl.Container.js");
require("../display/agl.Image.js");
require("../utils/agl.Utils.js");
require("../utils/agl.Matrix3.js");
require("./agl.RendererHelper.js");

AGL.BaseRenderer = createPrototypeClass(
  AGL.Container,
  function BaseRenderer(config) {
    config.vertexShader   = config.vertexShader   || AGL.BaseRenderer.createVertexShader;
    config.fragmentShader = config.fragmentShader || AGL.BaseRenderer.createFragmentShader;

    Object.freeze(config);

    AGL.Container.call(this);

    this.clearColor = new AGL.ColorProps();

    cnst(this, "_MAX_BATCH_ITEMS", 10000);

    this._clearBeforeRender = true;
    this._clearBeforeRenderFunc = this.clear.bind(this);

    this._rndrId = 0;

    this._latestBlendMode = AGL.BlendModes.NORMAL;

    this._batchItems = 0;

    this._textureMap = [];
    this._textureIds = [];

    this._textureIdBufUpdated = false;

    this._config = config;

    AGL.RendererHelper.init.call(this, config.canvas);

    var program = AGL.Utils.createProgram(this._gl, [
      AGL.Utils.loadVertexShader(this._gl,   config.vertexShader(config)),
      AGL.Utils.loadFragmentShader(this._gl, config.fragmentShader(config))
    ]);
    this._locations = AGL.Utils.getLocationsFor(this._gl, program, Object.assign(config.locations, {
      "aPos"      : "getAttribLocation",
      "aMat"      : "getAttribLocation",
      "aWorldMat" : "getAttribLocation",
      "aTexMat"   : "getAttribLocation",
      "aTexCrop"  : "getAttribLocation",
      "uTex"      : "getUniformLocation",
    }));

    this._gl.useProgram(program);

    this._setBlendMode();

    var positionBuf = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionBuf);
    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      new Float32Array([
        0, 0,
        1, 0,
        1, 1,
        0, 1
      ]),
      this._gl.STATIC_DRAW
    );
    this._gl.vertexAttribPointer(this._locations["aPos"], 2, this._gl.FLOAT, false, 0, 0);
    this._gl.enableVertexAttribArray(this._locations["aPos"]);

    var indexBuf = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuf);
    this._gl.bufferData(
      this._gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([
        0, 1, 2,
        0, 2, 3
      ]),
      this._gl.STATIC_DRAW
    );

    this._matrixDat        = new Float32Array(this._MAX_BATCH_ITEMS * 9);
		this._matrixBuf        = this._createArBuf(this._matrixDat,        "aMat",      9, 3, 3, this._gl.FLOAT, 4);
    this._worldMatrixDat   = new Float32Array(this._MAX_BATCH_ITEMS * 9);
		this._worldMatrixBuf   = this._createArBuf(this._matrixDat,        "aWorldMat", 9, 3, 3, this._gl.FLOAT, 4);
    this._textureMatrixDat = new Float32Array(this._MAX_BATCH_ITEMS * 9);
    this._textureMatrixBuf = this._createArBuf(this._textureMatrixDat, "aTexMat",   9, 3, 3, this._gl.FLOAT, 4);
    this._textureCropDat   = new Float32Array(this._MAX_BATCH_ITEMS * 4);
    this._textureCropBuf   = this._createArBuf(this._textureCropDat,   "aTexCrop",  4, 1, 4, this._gl.FLOAT, 4);

    this._drawFunctionMap = {};
    this._drawFunctionMap[AGL.Item.TYPE] = emptyFunction;
    this._drawFunctionMap[AGL.Image.TYPE] = this._drawImage.bind(this);
    this._drawFunctionMap[AGL.Container.TYPE] = this._drawContainer.bind(this);

    this._update      =
    this._updateProps = emptyFunction;

    this._rsz();
  },
  function() {
    AGL.RendererHelper.createFunctionality.call(this);

    prop(this, "clearBeforeRender", {
      get: function() { return this._clearBeforeRender; },
      set: function(v) {
        this._clearBeforeRender = v;
        this._clearBeforeRenderFunc = v
          ? this.clear.bind(this)
          : emptyFunction;
      }
    });

    get(this, "stage",  function() { return this; });

    this.clear = function() {
      var clearColor = this.clearColor;
      clearColor.isUpdated() && this._gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
      this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }

    this._rndr = function() {
      this._clearBeforeRenderFunc();
      this._rndrTimer = Date.now();
      this._drawContainer(this);
      this._batchItems > 0 && this._batchDraw();
      ++this._rndrId;
    }

    this._drawItem = function(item, parent) {
      if (!item.renderable) return;
      item.update(this._rndrTimer, parent);
      item.type !== AGL.Item.TYPE && this._drawFunctionMap[item.type](item, parent);
    }

    this._drawContainer = function(container) {
      var children = container.children;
      var i;
      var l;
      for (i = 0, l = children.length; i < l; ++i) this._drawItem(children[i], container);
    }

    this._checkBlendMode = function(item) {
      if (this._latestBlendMode !== item.blendMode) {
        this._batchDraw();
        this._latestBlendMode = item.blendMode;
        this._setBlendMode();
      }
    }

    this._setBufDat = function(item, parent, textureMapIndex, matId, quadId) {
      arraySet(this._worldMatrixDat,   parent.matrixCache,      matId);
      arraySet(this._matrixDat,        item.matrixCache,        matId);
      arraySet(this._textureMatrixDat, item.textureMatrixCache, matId);
      arraySet(this._textureCropDat,   item.textureCropCache,   quadId);
    }

    this._drawImage = function(item, parent) {
      this._checkBlendMode(item);

      var textureMapIndex = this._drawTex(item.texture);

      this._setBufDat(
        item,
        parent,
        textureMapIndex,
        this._batchItems * 9,
        this._batchItems * 4
      );

      ++this._batchItems === this._MAX_BATCH_ITEMS && this._batchDraw();
    }

    this._createArBuf = function(data, locationId, length, num, size, type, bytes) {
      var buffer = this._gl.createBuffer();
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
  		this._gl.bufferData(this._gl.ARRAY_BUFFER, data.byteLength, this._gl.DYNAMIC_DRAW);

      this._attachArBuf(this._locations[locationId], buffer, data, length, num, size, type, bytes);

      return buffer;
    }

    this._attachArBuf = function(location, buffer, data, length, num, size, type, bytes) {
      this._bindArBuf(buffer, data);

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

    this._bindArBuf = function(buffer, data) {
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
  		this._gl.bufferSubData(this._gl.ARRAY_BUFFER, 0, data);
    }

    this._bindBufs = function() {
      this._bindArBuf(this._matrixBuf,        this._matrixDat);
      this._bindArBuf(this._worldMatrixBuf,   this._worldMatrixDat);
      this._bindArBuf(this._textureMatrixBuf, this._textureMatrixDat);
      this._bindArBuf(this._textureCropBuf,   this._textureCropDat);
    }

    this._batchDraw = function() {
      if (this._textureIdBufUpdated) {
        this._textureIdBufUpdated = false;
        var textureIdBuffer = new Uint16Array(this._textureIds);
        this._gl.uniform1iv(this._locations["uTex"], textureIdBuffer);
      }

      this._bindBufs();

      this._gl.drawElementsInstanced(this._gl.TRIANGLE_FAN, 6, this._gl.UNSIGNED_SHORT, 0, this._batchItems);

      this._batchItems = 0;
    }

    this._drawTex = function(textureInfo) {
      if (!textureInfo.loaded) return 0;
      var textureMapIndex = this._textureMap.indexOf(textureInfo);
      if (textureMapIndex === -1 || textureInfo.autoUpdate(this._rndrId)) {
        if (textureMapIndex === -1) {
          if (this._textureMap.length === this._config.textureNum) {
            this._batchDraw();
            this._textureIds.length =
            this._textureMap.length = 0;
          }
          this._textureMap.push(textureInfo);
          textureMapIndex = this._textureMap.length - 1;
          this._textureIds.push(textureMapIndex);
          this._textureIdBufUpdated = true;
        }

        AGL.Utils.useTexture(this._gl, textureMapIndex, textureInfo);
      }

      return textureMapIndex + 1;
    }

    this._setBlendMode = function() {
      this._gl[this._latestBlendMode.funcName](
        this._gl[this._latestBlendMode.funcs[0]],
        this._gl[this._latestBlendMode.funcs[1]],
        this._gl[this._latestBlendMode.funcs[2]],
        this._gl[this._latestBlendMode.funcs[3]]
      );
    }

    this._rsz = function() {
      if (!this._rszCanvas()) return false;

      AGL.Matrix3.projection(this._w, this._h, this.matrixCache);

      this.worldPropsUpdateId++;

      return true;
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
