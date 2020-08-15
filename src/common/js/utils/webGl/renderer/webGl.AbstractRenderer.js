require("../NameSpace.js");
require("../webGl.Bitmap.js");
require("../display/webGl.BlendModes.js");
require("../display/webGl.Item.js");
require("../display/webGl.Container.js");
require("../display/webGl.Image.js");
require("../utils/webGl.Utils.js");
require("../utils/webGl.Matrix3.js");

WebGl.AbstractRenderer = createPrototypeClass(
  WebGl.Container,
  function AbstractRenderer(webGlBitmap, vertexShader, fragmentShader, locations, config) {
    WebGl.Container.call(this);

    this._webGlUtils  = WebGl.Utils.instance;

    this._MAX_BATCH_ITEMS = 10000;

    this._renderId = 0;

    this._latestBlendMode = WebGl.BlendModes.NORMAL;

    this._batchItems = 0;

    this._textureMap = [];
    this._textureIds = [];

    this._textureIdBufferUpdated = false;

    this._shouldResize = true;

    this._config = config;

    this._onResizeBind = this._onResize.bind(this);

    this._webGlBitmap = webGlBitmap;
    this._webGlBitmap.addEventListener(WebGl.Bitmap.RESIZE, this._onResizeBind);

    this._gl = this._webGlBitmap.getContext();

    this._program = this._webGlUtils.createProgram(this._gl, [
      this._webGlUtils.loadShader(this._gl, WebGl.Utils.ShaderType.VERTEX_SHADER,   vertexShader(this._config)),
      this._webGlUtils.loadShader(this._gl, WebGl.Utils.ShaderType.FRAGMENT_SHADER, fragmentShader(this._config))
    ]);
    this._locations = this._webGlUtils.getLocationsFor(this._gl, this._program, locations || {
      "a_position"    : "getAttribLocation",
      "a_matrix"      : "getAttribLocation",
      "a_worldMatrix" : "getAttribLocation",
      "a_texMatrix"   : "getAttribLocation",
      "a_texCrop"     : "getAttribLocation",
      "u_tex"         : "getUniformLocation",
    });

    this._gl.useProgram(this._program);

    this._setBlendMode();

    var positionBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionBuffer);
    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      new Float32Array([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]),
      this._gl.STATIC_DRAW
    );
    this._gl.vertexAttribPointer(this._locations["a_position"], 2, this._gl.FLOAT, false, 0, 0);
    this._gl.enableVertexAttribArray(this._locations["a_position"]);

    var indexBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this._gl.bufferData(
      this._gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      this._gl.STATIC_DRAW
    );

    this._matrixData          = new Float32Array(this._MAX_BATCH_ITEMS * 9);
		this._matrixBuffer        = this._createArrayBuffer(this._matrixData,        "a_matrix",      9, 3, 3, this._gl.FLOAT, 4);
    this._worldMatrixData     = new Float32Array(this._MAX_BATCH_ITEMS * 9);
		this._worldMatrixBuffer   = this._createArrayBuffer(this._matrixData,        "a_worldMatrix", 9, 3, 3, this._gl.FLOAT, 4);
    this._textureMatrixData   = new Float32Array(this._MAX_BATCH_ITEMS * 9);
    this._textureMatrixBuffer = this._createArrayBuffer(this._textureMatrixData, "a_texMatrix",   9, 3, 3, this._gl.FLOAT, 4);
    this._textureCropData     = new Float32Array(this._MAX_BATCH_ITEMS * 4);
    this._textureCropBuffer   = this._createArrayBuffer(this._textureCropData,   "a_texCrop",     4, 1, 4, this._gl.FLOAT, 4);

    this._drawFunctionMap = {};
    this._drawFunctionMap[WebGl.Item.TYPE] = emptyFunction;
    this._drawFunctionMap[WebGl.Image.TYPE] = this._drawImage.bind(this);
    this._drawFunctionMap[WebGl.Container.TYPE] = this._drawContainer.bind(this);

    this._update      =
    this._updateProps = emptyFunction;

    this._resize();
  },
  function(_super) {
    get(this, "bitmap", function() { return this._webGlBitmap; });
    get(this, "stage",  function() { return this; });

    this.render = function() {
      this._resize();
      this._render();
    }

    this.destruct = function() {
      this._webGlBitmap.removeEventListener(WebGl.Bitmap.RESIZE, this._onResizeBind);

      _super.destruct.call(this);
    }

    this._render = function() {
      this._webGlBitmap.clearRect();
      this._renderTimer = Date.now();
      this._drawContainer(this);
      this._batchItems > 0 && this._batchDraw();
      ++this._renderId;
    }

    this._drawItem = function(item, parent) {
      if (!item.renderable) return;
      item.update(this._renderTimer, parent);
      item.type !== WebGl.Item.TYPE && this._drawFunctionMap[item.type](item, parent);
    }

    this._drawContainer = function(container) {
      var children = container.children;
      var i;
      var l;
      for (i = 0, l = children.length; i < l; ++i) {
        this._drawItem(children[i], container);
      }
    }

    this._checkBlendMode = function(item) {
      if (this._latestBlendMode !== item.blendMode) {
        this._batchDraw();
        this._latestBlendMode = item.blendMode;
        this._setBlendMode();
      }
    }

    this._setBufferData = function(item, parent, textureMapIndex, matId, quadId) {
      arraySet(this._worldMatrixData,   parent.matrixCache,      matId);
      arraySet(this._matrixData,        item.matrixCache,        matId);
      arraySet(this._textureMatrixData, item.textureMatrixCache, matId);
      arraySet(this._textureCropData,   item.textureCropCache,   quadId);
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
          type === this._gl.FLOAT
          ? "vertexAttribPointer"
          : "vertexAttribIPointer"
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
        this._gl.uniform1iv(this._locations["u_tex"], textureIdBuffer);
      }

      this._bindBuffers();

      this._gl.drawElementsInstanced(this._gl.TRIANGLE_FAN, 6, this._gl.UNSIGNED_SHORT, 0, this._batchItems);

      this._batchItems = 0;
    }

    this._drawTexture = function(textureInfo) {
      if (!textureInfo.loaded) return 0;
      var textureMapIndex = this._textureMap.indexOf(textureInfo);
      if (textureMapIndex === -1 || textureInfo.autoUpdate(this._renderId)) {
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

        this._webGlUtils.useTexture(this._gl, textureMapIndex, textureInfo);
      }

      return textureMapIndex + 1;
    }

    this._setBlendMode = function() {
      this._latestBlendMode.length === 4
        ? this._gl.blendFuncSeparate(
            this._gl[this._latestBlendMode[0]],
            this._gl[this._latestBlendMode[1]],
            this._gl[this._latestBlendMode[2]],
            this._gl[this._latestBlendMode[3]]
          )
        : this._gl.blendFunc(
            this._gl[this._latestBlendMode[0]],
            this._gl[this._latestBlendMode[1]]
          );
    }

    this._resize = function() {
      if (!this._shouldResize) return false;
      this._shouldResize = false;

      this._width  = this._webGlBitmap.bitmapWidth;
      this._height = this._webGlBitmap.bitmapHeight;

      this._widthHalf  = this._width * 0.5;
      this._heightHalf = this._height * 0.5;

      WebGl.Matrix3.projection(this._width, this._height, this.matrixCache);

      this.worldPropsUpdateId++;

      return true;
    }

    this._onResize = function() {
      this._shouldResize = true;
    }
  }
);
rof(WebGl.AbstractRenderer, "createVertexShader", function() {
  return "#version 300 es\n" +
  "in vec2 a_position;" +
  "in mat3 a_matrix;" +
  "in mat3 a_worldMatrix;" +
  "in mat3 a_texMatrix;" +
  "in vec4 a_texCrop;" +

  "out vec2 v_texCoord;" +
  "out vec2 v_texCrop;" +
  "out vec2 v_texCropSize;" +

  "void main(void) {" +
    "vec3 pos = vec3(a_position, 1.0);" +
    "gl_Position = vec4((a_worldMatrix * a_matrix * pos).xy, 0.0, 1.0);" +
    "v_texCoord = (a_texMatrix * pos).xy;" +
    "v_texCrop = a_texCrop.xy;" +
    "v_texCropSize = a_texCrop.zw - a_texCrop.xy;" +
  "}";
});
rof(WebGl.AbstractRenderer, "createFragmentShader", function() {
  return "#version 300 es\n" +
  "precision lowp float;" +

  "in vec2 v_texCoord;" +
  "in vec2 v_texCrop;" +
  "in vec2 v_texCropSize;" +

  "out vec4 fragColor;" +
  "void main(void) {" +
    "fragColor = vec4(1.0, 0.0, 1.0, 1.0);" +
  "}";
});
