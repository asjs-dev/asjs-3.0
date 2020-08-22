require("../NameSpace.js");
require("../agl.Bitmap.js");
require("../data/agl.BlendModes.js");
require("../display/agl.Item.js");
require("../display/agl.Container.js");
require("../display/agl.Image.js");
require("../utils/agl.Utils.js");
require("../utils/agl.Matrix3.js");

AGL.BaseRenderer = createPrototypeClass(
  AGL.Container,
  function BaseRenderer(webGlBitmap, vertexShader, fragmentShader, locations, config) {
    AGL.Container.call(this);

    this._MAX_BATCH_ITEMS = 10000;

    this._width  = 0;
    this._height = 0;

    this._renderId = 0;

    this._latestBlendMode = AGL.BlendModes.NORMAL;

    this._batchItems = 0;

    this._textureMap = [];
    this._textureIds = [];

    this._textureIdBufferUpdated = false;

    this._shouldResize = true;

    this._config = config;

    this._onResizeBind = this._onResize.bind(this);

    this._webGlBitmap = webGlBitmap;
    this._webGlBitmap.addEventListener(AGL.Bitmap.RESIZE, this._onResizeBind);

    this._gl = this._webGlBitmap.getContext();

    var program = AGL.Utils.createProgram(this._gl, [
      AGL.Utils.loadShader(this._gl, AGL.Utils.ShaderType.VERTEX_SHADER,   vertexShader(this._config)),
      AGL.Utils.loadShader(this._gl, AGL.Utils.ShaderType.FRAGMENT_SHADER, fragmentShader(this._config))
    ]);
    this._locations = AGL.Utils.getLocationsFor(this._gl, program, Object.assign(locations || {}, {
      "a_pos"      : "getAttribLocation",
      "a_mat"      : "getAttribLocation",
      "a_worldMat" : "getAttribLocation",
      "a_texMat"   : "getAttribLocation",
      "a_texCrop"  : "getAttribLocation",
      "u_tex"      : "getUniformLocation",
    }));

    this._gl.useProgram(program);

    this._setBlendMode();

    var positionBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionBuffer);
    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      new Float32Array([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]),
      this._gl.STATIC_DRAW
    );
    this._gl.vertexAttribPointer(this._locations["a_pos"], 2, this._gl.FLOAT, false, 0, 0);
    this._gl.enableVertexAttribArray(this._locations["a_pos"]);

    var indexBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this._gl.bufferData(
      this._gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      this._gl.STATIC_DRAW
    );

    this._matrixData          = new Float32Array(this._MAX_BATCH_ITEMS * 9);
		this._matrixBuffer        = this._createArBuf(this._matrixData,        "a_mat",      9, 3, 3, this._gl.FLOAT, 4);
    this._worldMatrixData     = new Float32Array(this._MAX_BATCH_ITEMS * 9);
		this._worldMatrixBuffer   = this._createArBuf(this._matrixData,        "a_worldMat", 9, 3, 3, this._gl.FLOAT, 4);
    this._textureMatrixData   = new Float32Array(this._MAX_BATCH_ITEMS * 9);
    this._textureMatrixBuffer = this._createArBuf(this._textureMatrixData, "a_texMat",   9, 3, 3, this._gl.FLOAT, 4);
    this._textureCropData     = new Float32Array(this._MAX_BATCH_ITEMS * 4);
    this._textureCropBuffer   = this._createArBuf(this._textureCropData,   "a_texCrop",  4, 1, 4, this._gl.FLOAT, 4);

    this._drawFunctionMap = {};
    this._drawFunctionMap[AGL.Item.TYPE] = emptyFunction;
    this._drawFunctionMap[AGL.Image.TYPE] = this._drawImage.bind(this);
    this._drawFunctionMap[AGL.Container.TYPE] = this._drawContainer.bind(this);

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
      this._webGlBitmap.removeEventListener(AGL.Bitmap.RESIZE, this._onResizeBind);

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
      arraySet(this._worldMatrixData,   parent.matrixCache,      matId);
      arraySet(this._matrixData,        item.matrixCache,        matId);
      arraySet(this._textureMatrixData, item.textureMatrixCache, matId);
      arraySet(this._textureCropData,   item.textureCropCache,   quadId);
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
      this._bindArBuf(this._matrixBuffer,        this._matrixData);
      this._bindArBuf(this._worldMatrixBuffer,   this._worldMatrixData);
      this._bindArBuf(this._textureMatrixBuffer, this._textureMatrixData);
      this._bindArBuf(this._textureCropBuffer,   this._textureCropData);
    }

    this._batchDraw = function() {
      if (this._textureIdBufferUpdated) {
        this._textureIdBufferUpdated = false;
        var textureIdBuffer = new Uint16Array(this._textureIds);
        this._gl.uniform1iv(this._locations["u_tex"], textureIdBuffer);
      }

      this._bindBufs();

      this._gl.drawElementsInstanced(this._gl.TRIANGLE_FAN, 6, this._gl.UNSIGNED_SHORT, 0, this._batchItems);

      this._batchItems = 0;
    }

    this._drawTex = function(textureInfo) {
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

    this._resize = function() {
      if (!this._shouldResize) return false;
      this._shouldResize = false;

      this._width  = this._webGlBitmap.bitmapWidth;
      this._height = this._webGlBitmap.bitmapHeight;

      AGL.Matrix3.projection(this._width, this._height, this.matrixCache);

      this.worldPropsUpdateId++;

      return true;
    }

    this._onResize = function() {
      this._shouldResize = true;
    }
  }
);
rof(AGL.BaseRenderer, "createVertexShader", function() {
  return "#version 300 es\n" +
  "in vec2 a_pos;" +
  "in mat3 a_mat;" +
  "in mat3 a_worldMat;" +
  "in mat3 a_texMat;" +
  "in vec4 a_texCrop;" +

  "out vec2 v_texCoord;" +
  "out vec2 v_texCrop;" +
  "out vec2 v_texCropSize;" +

  "void main(void){" +
    "vec3 pos=vec3(a_pos,1.0);" +
    "gl_Position=vec4((a_worldMat*a_mat*pos).xy,0.0,1.0);" +
    "v_texCoord=(a_texMat*pos).xy;" +
    "v_texCrop=a_texCrop.xy;" +
    "v_texCropSize=a_texCrop.zw-a_texCrop.xy;" +
  "}";
});
rof(AGL.BaseRenderer, "createFragmentShader", function() {
  return "#version 300 es\n" +
  "precision lowp float;" +

  "in vec2 v_texCoord;" +
  "in vec2 v_texCrop;" +
  "in vec2 v_texCropSize;" +

  "out vec4 fgCol;" +
  "void main(void){" +
    "fgCol=vec4(1.0,0.0,1.0,1.0);" +
  "}";
});
