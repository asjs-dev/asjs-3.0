require("../NameSpace.js");
require("./webGl.Container.js");
require("./webGl.BlendModes.js");

WebGl.Stage2D = createPrototypeClass(
  WebGl.Container,
  function Stage2D(webGlBitmap, vertexShader, fragmentShader, config) {
    WebGl.Container.call(this);

    this._webGlUtils  = WebGl.Utils.instance;
    this._matrixUtils = WebGl.Matrix3;

    cnst(this, "_MAX_BATCH_ITEMS", 10000);

    cnst(this, "_DEFAULT_DUO",  [0, 0]);
    cnst(this, "_DEFAULT_QUAD", [0, 0, 0, 0]);

    cnst(this, "_SHADER_LOCATIONS", {
      "a_position"       : "getAttribLocation",
      "a_matrix"         : "getAttribLocation",
      "a_worldMatrix"    : "getAttribLocation",
      "a_texMatrix"      : "getAttribLocation",
      "a_texCrop"        : "getAttribLocation",
      "a_fillColor"      : "getAttribLocation",
      "a_tintColor"      : "getAttribLocation",
      "a_effects"        : "getAttribLocation",
      "u_resolution"     : "getUniformLocation",
      "u_tex"            : "getUniformLocation",
      "u_lightPositions" : "getUniformLocation",
      "u_lightVolumes"   : "getUniformLocation",
      "u_lightColors"    : "getUniformLocation",
      "u_lightEffects"   : "getUniformLocation",
      "u_fog"            : "getUniformLocation",
      "u_filters"        : "getUniformLocation",
    });

    this.fog = new WebGl.ColorProps();

    this.colorCache = this.color.items;

    this._latestBlendMode = WebGl.BlendModes.NORMAL;

    this._batchItems = 0;

    this._textureMap = [];
    this._textureIds = [];

    this._attachedLights = [];

    this._textureIdBufferUpdated = false;

    this._shouldResize = true;

    this._pickedElements = [];
    this._isPickerSet = false;

    this._tempPickerVector  = new Float32Array([0, 0, 1]);
    this._tempMatrix        = new Float32Array(6);
    this._tempInverseMatrix = new Float32Array(6);

    this._config = config;

    this._onResizeBind = this._onResize.bind(this);

    this._webGlBitmap = webGlBitmap;
    this._webGlBitmap.addEventListener(WebGl.Bitmap.RESIZE, this._onResizeBind);

    this._gl = this._webGlBitmap.getContext();

    this._program = this._webGlUtils.createProgram(this._gl, [
      this._webGlUtils.loadShader(this._gl, WebGl.Utils.ShaderType.VERTEX_SHADER,   vertexShader(this._config)),
      this._webGlUtils.loadShader(this._gl, WebGl.Utils.ShaderType.FRAGMENT_SHADER, fragmentShader(this._config))
    ]);
    this._locations = this._webGlUtils.getLocationsFor(this._gl, this._program, this._SHADER_LOCATIONS);

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

    if (this._config.showLights) {
      this._lightPositions = new Float32Array(this._config.lightsNum * 2);
      this._lightVolumes   = new Float32Array(this._config.lightsNum * 2);
      this._lightColors    = new Float32Array(this._config.lightsNum * 4);
      this._lightEffects   = new Float32Array(this._config.lightsNum * 4);
    }
    this._collectLightsFunc = this._config.showLights
      ? this._collectLights.bind(this)
      : emptyFunction;

    this._matrixData          = new Float32Array(this._MAX_BATCH_ITEMS * 9);
		this._matrixBuffer        = this._createArrayBuffer(this._matrixData,        "a_matrix",      9, 3, 3, this._gl.FLOAT, 4);
    this._worldMatrixData     = new Float32Array(this._MAX_BATCH_ITEMS * 9);
		this._worldMatrixBuffer   = this._createArrayBuffer(this._matrixData,        "a_worldMatrix", 9, 3, 3, this._gl.FLOAT, 4);
    this._textureMatrixData   = new Float32Array(this._MAX_BATCH_ITEMS * 9);
    this._textureMatrixBuffer = this._createArrayBuffer(this._textureMatrixData, "a_texMatrix",   9, 3, 3, this._gl.FLOAT, 4);
    this._textureCropData     = new Float32Array(this._MAX_BATCH_ITEMS * 4);
    this._textureCropBuffer   = this._createArrayBuffer(this._textureCropData,   "a_texCrop",     4, 1, 4, this._gl.FLOAT, 4);
    this._colorData           = new Float32Array(this._MAX_BATCH_ITEMS * 4);
    this._colorBuffer         = this._createArrayBuffer(this._colorData,         "a_fillColor",   4, 1, 4, this._gl.FLOAT, 4);
    this._tintColorData       = new Float32Array(this._MAX_BATCH_ITEMS * 4);
    this._tintColorBuffer     = this._createArrayBuffer(this._tintColorData,     "a_tintColor",   4, 1, 4, this._gl.FLOAT, 4);

    this._effectLength = (this._config.useMask ? 3 : 2);
    this._effectData   = new Float32Array(this._MAX_BATCH_ITEMS * this._effectLength);
    this._effectBuffer = this._createArrayBuffer(this._effectData, "a_effects", this._effectLength, 1, this._effectLength, this._gl.FLOAT, 4);

    this._setMaskDataFunc = this._config.useMask
      ? this._setMaskData.bind(this)
      : emptyFunction;

    this._resize();

    this.fog.a = 0;
    this.filters = WebGl.Stage2D.Filters.NONE;

    this._drawFunctionMap = {};
    this._drawFunctionMap[WebGl.Item.TYPE] = emptyFunction;
    this._drawFunctionMap[WebGl.Image.TYPE] = this._drawImage.bind(this);
    this._drawFunctionMap[WebGl.Container.TYPE] = this._drawContainer.bind(this);

    this._update      =
    this._updateProps = emptyFunction;
  },
  function(_super) {
    set(this, "filters", function(f) {
      this._config.filters && this._config.filters.length > 0 && this._gl.uniform1i(this._locations["u_filters"], f);
    });

    get(this, "bitmap",         function() { return this._webGlBitmap; });
    get(this, "stage",          function() { return this; });
    get(this, "pickedElements", function() { return this._pickedElements.clone(); });

    this.render = function() {
      this._renderTimer = Date.now();

      this._pickedElements.length = 0;

      this._resize();
      this._updateColor();
      this._updateFog();
      this._collectLightsFunc();
      this._drawContainer(this);

      this._batchItems > 0 && this._batchDraw();

      this._isPickerSet = false;
    }

    this.isLightAttached = function(light) {
      return this._attachedLights.has(light);
    }

    this.attachLight = function(light) {
      !this.isLightAttached(light) &&
      this._attachedLights.length < this._config.lightsNum &&
      this._attachedLights.push(light);
    }

    this.detachLight = function(light) {
      this._attachedLights.remove(light);
    }

    this.setPickerPoint = function(x, y) {
      this._isPickerSet = true;

      this._tempPickerVector[0] = (x - this._widthHalf) * this.matrixCache[0];
      this._tempPickerVector[1] = (y - this._heightHalf) * this.matrixCache[4];
    }

    this.destruct = function() {
      this._webGlBitmap.removeEventListener(WebGl.Bitmap.RESIZE, this._onResizeBind);

      _super.destruct();
    }

    this._updateFog = function() {
      var fog = this.fog;
      fog.isUpdated() && this._gl.uniform4fv(this._locations["u_fog"], fog.items);
    }

    this._collectLights = function() {
      var light;
      var douId;
      var quadId;
      var i;
      var l;
      for (i = 0, l = this._config.lightsNum; i < l; ++i) {
        duoId  = i * 2;
        quadId = i * 4;
        if (i >= this._attachedLights.length || !this._attachedLights[i].renderable) {
          arraySet(this._lightPositions, this._DEFAULT_DUO,  duoId);
          arraySet(this._lightVolumes,   this._DEFAULT_DUO,  duoId);
          arraySet(this._lightColors,    this._DEFAULT_QUAD, quadId);
          arraySet(this._lightEffects,   this._DEFAULT_QUAD, quadId);
        } else {
          light = this._attachedLights[i];
          arraySet(this._lightPositions, light.positionCache, duoId);
          arraySet(this._lightVolumes,   light.volumeCache,   duoId);
          arraySet(this._lightColors,    light.colorCache,    quadId);
          arraySet(this._lightEffects,   light.effectCache,   quadId);
        }
      }

      light = null;

      this._gl.uniform2fv(this._locations["u_lightPositions"], this._lightPositions);
      this._gl.uniform2fv(this._locations["u_lightVolumes"],   this._lightVolumes);
      this._gl.uniform4fv(this._locations["u_lightColors"],    this._lightColors);
      this._gl.uniform4fv(this._locations["u_lightEffects"],   this._lightEffects);
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

    this._setMaskData = function(item) {
      item.mask && (this._effectData[this._batchItems * this._effectLength + 2] = this._drawTexture(item.mask));
    }

    this._drawImage = function(item, parent) {
      if (this._latestBlendMode !== item.blendMode) {
        this._batchDraw();
        this._latestBlendMode = item.blendMode;
        this._setBlendMode();
      }

      if (
        this._isPickerSet &&
        item.interactive &&
        this._matrixUtils.isPointInMatrix(this._tempPickerVector, parent.matrixCache, item.matrixCache, this._tempMatrix, this._tempInverseMatrix)
      ) this._pickedElements.push(item);

      this._setMaskDataFunc(item);

      var textureMapIndex = this._drawTexture(item.texture);

      var quadId   = this._batchItems * 4;
      var matId    = this._batchItems * 9;
      var effectId = this._batchItems * this._effectLength;

      arraySet(this._worldMatrixData, parent.matrixCache, matId);
      arraySet(this._matrixData, item.matrixCache, matId);
      arraySet(this._textureMatrixData, item.textureMatrixCache, matId);
      arraySet(this._textureCropData, item.textureCropCache, quadId);
      arraySet(this._colorData, parent.colorCache, quadId);
      arraySet(this._tintColorData, item.colorCache, quadId);
      this._effectData[effectId] = textureMapIndex;
      this._effectData[effectId + 1] = item.tintType;

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

    this._batchDraw = function() {
      if (this._textureIdBufferUpdated) {
        this._textureIdBufferUpdated = false;
        var textureIdBuffer = new Uint16Array(this._textureIds);
        this._gl.uniform1iv(this._locations["u_tex"], textureIdBuffer);
      }

      this._bindArrayBuffer(this._matrixBuffer,        this._matrixData);
      this._bindArrayBuffer(this._worldMatrixBuffer,   this._worldMatrixData);
      this._bindArrayBuffer(this._textureMatrixBuffer, this._textureMatrixData);
      this._bindArrayBuffer(this._textureCropBuffer,   this._textureCropData);
  		this._bindArrayBuffer(this._colorBuffer,         this._colorData);
      this._bindArrayBuffer(this._tintColorBuffer,     this._tintColorData);
      this._bindArrayBuffer(this._effectBuffer,        this._effectData);

      //this._gl.drawArraysInstanced(this._gl.TRIANGLE_FAN, 0, 4, this._batchItems);
      this._gl.drawElementsInstanced(this._gl.TRIANGLE_FAN, 6, this._gl.UNSIGNED_SHORT, 0, this._batchItems);

      this._batchItems = 0;
    }

    this._drawTexture = function(textureInfo) {
      if (!textureInfo.loaded) return 0;
      var textureMapIndex = this._textureMap.indexOf(textureInfo);
      if (textureMapIndex === -1 || textureInfo.autoUpdate) {
        if (textureMapIndex === -1) {
          if (this._textureMap.length === this._webGlUtils.webGlInfo.maxTextureImageUnits) {
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
      if (!this._shouldResize) return;
      this._shouldResize = false;

      this._width  = this._webGlBitmap.bitmapWidth;
      this._height = this._webGlBitmap.bitmapHeight;

      this._widthHalf  = this._width * 0.5;
      this._heightHalf = this._height * 0.5;

      this._matrixUtils.projection(this._width, this._height, this.matrixCache);

      this._gl.uniform2f(this._locations["u_resolution"], this._width / this._height, 100 / this._width);

      this.worldPropsUpdateId++;
    }

    this._onResize = function() {
      this._shouldResize = true;
    }

    this._updateColor = function() {
      this.color.isUpdated() && this.worldColorUpdateId++;
    }
  }
);
cnst(WebGl.Stage2D, "MAX_LIGHT_SOURCES", 16);
rof(WebGl.Stage2D, "createVertexShader", function(config) {
  var shader = "#version 300 es\n" +
  "in vec2 a_position;" +
  "in mat3 a_matrix;" +
  "in mat3 a_worldMatrix;" +
  "in mat3 a_texMatrix;" +
  "in vec4 a_texCrop;" +
  "in vec4 a_fillColor;" +
  "in vec4 a_tintColor;" +
  "in vec" + (config.useMask ? "3" : "2") + " a_effects;";

  shader +=
  "out vec2 v_texCoord;" +
  "out vec4 v_coord;" +
  "out vec2 v_texCrop;" +
  "out vec2 v_texCropSize;" +
  "out vec4 v_fillColor;" +
  "out vec4 v_tintColor;" +
  "out float v_texId;" +
  "out float v_tintType;";

  if (config.useMask) shader += "out float v_maskTexId;";

  shader +=
  "void main(void) {" +
    "vec3 pos = vec3(a_position, 1.0);" +
    "gl_Position = vec4((a_worldMatrix * a_matrix * pos).xy, 0.0, 1.0);" +
    "v_texCoord = (a_texMatrix * pos).xy;" +
    "v_coord = gl_Position;" +
    "v_texCrop = a_texCrop.xy;" +
    "v_texCropSize = a_texCrop.zw - a_texCrop.xy;" +
    "v_fillColor = a_fillColor;" +
    "v_tintColor = a_tintColor;" +

    "v_texId = a_effects.x;" +
    "v_tintType = a_effects.y;";

    if (config.useMask) shader += "v_maskTexId = a_effects.z;";

    shader += "}";

  return shader;
});
rof(WebGl.Stage2D, "createFragmentShader", function(config) {
  var maxTextureImageUnits = WebGl.Utils.instance.webGlInfo.maxTextureImageUnits;
  var maxLightSources = config.lightsNum;

  var shader = "#version 300 es\n" +
  "#define MAX_TEXTURES " + maxTextureImageUnits + "\n"+
  "#define MAX_LIGHT_SOURCES " + maxLightSources + "\n"+
  "precision lowp float;" +

  "in vec4 v_coord;" +
  "in vec2 v_texCoord;" +
  "in vec2 v_texCrop;" +
  "in vec2 v_texCropSize;" +
  "in vec4 v_fillColor;" +
  "in vec4 v_tintColor;" +
  "in float v_texId;" +
  "in float v_tintType;";

  if (config.useMask) shader += "in float v_maskTexId;";

  shader +=
  "uniform sampler2D u_tex[MAX_TEXTURES];" +

  "uniform vec2 u_resolution;" +
  "uniform vec4 u_fog;";

  if (config.filters && config.filters.length > 0) shader += "uniform int u_filters;";

  if (config.showLights) {
    shader +=
    "uniform vec2 u_lightPositions[MAX_LIGHT_SOURCES];" +
    "uniform vec2 u_lightVolumes[MAX_LIGHT_SOURCES];" +
    "uniform vec4 u_lightColors[MAX_LIGHT_SOURCES];" +
    "uniform vec4 u_lightEffects[MAX_LIGHT_SOURCES];";
  }

  shader += "out vec4 fragColor;";

  if (config.showLights) {
    shader +=
    "vec4 lightValue(vec2 lightPosition, vec2 lightVolume, vec4 lightColor, vec4 lightEffect) {" +
      "vec2 dist = v_coord.xy - lightPosition;" +
      "return lightColor * lightColor.a * max(0.0, min(1.0, 1.0 - sqrt(" +
        "pow(abs(dist.x + (abs(dist.x) * lightEffect.x)), lightEffect.z) * (lightVolume.x / u_resolution.y) + " +
        "pow(abs(dist.y + (abs(dist.y) * lightEffect.y)), lightEffect.w) * (lightVolume.y / u_resolution.x / u_resolution.y)" +
      ")));" +
    "}";
  }

  shader +=
  "void main(void) {";

    if (config.useMask) {
      shader +=
      "float maskAlpha = 1.0;" +
      "if (v_maskTexId > 0.0) {";
        for (var i = 0; i < maxTextureImageUnits; i++) {
          shader += (i > 0 ? " else " : "") +
          "if (v_maskTexId < " + (i + 1) + ".5) {" +
            "maskAlpha = texture(u_tex[" + i + "], (v_coord.xy + vec2(1.0, -1.0)) / vec2(2.0, -2.0)).a;" +
          "}";
        }
      shader += "}";
    }

    for (var i = -1; i < maxTextureImageUnits; i++) {
      shader += (i > -1 ? " else " : "") +
      "if (v_texId < " + (i + 1) + ".5) {";
        shader += i < 0
          ? "fragColor = vec4(1.0, 0.0, 1.0, 1.0);"
          : "fragColor = texture(u_tex[" + i + "], v_texCrop + v_texCropSize * fract(v_texCoord));";
      shader +=
      "}";
    }

    shader +=
    "if (fragColor.a > 0.0) {" +
      "if (v_tintType < 0.5) " +
        "fragColor *= v_tintColor;" +
      "else if (v_tintType < 1.5 && fragColor.r == fragColor.g && fragColor.r == fragColor.b) " +
        "fragColor *= v_tintColor;" +
      "else if (v_tintType < 2.5) " +
        "fragColor = vec4((fragColor.rgb * (1.0 - v_tintColor.a)) + (v_tintColor.rgb * v_tintColor.a), fragColor.a);" +
      "vec4 lightColor = vec4(0.0);";

      if (config.showLights) {
        for (var i = 0; i < maxLightSources; i++) {
          shader +=
          "if (u_lightColors[" + i + "].a > 0.0) {" +
            "lightColor += lightValue(" +
              "u_lightPositions[" + i + "], " +
              "u_lightVolumes[" + i + "], " +
              "u_lightColors[" + i + "], " +
              "u_lightEffects[" + i + "]" +
            ");" +
          "}";
        }
      }

      shader +=
      "float colorLightMultiply = max(0.0, u_fog.a - lightColor.a);" +
      "float colorMultiply = max(0.0, 1.0 - colorLightMultiply);" +
      "vec4 fogColor = vec4(u_fog.rgb * colorLightMultiply, 0.0);" +
      "vec4 finalColor = vec4(fragColor.rgb * colorMultiply, fragColor.a);" +
      "fragColor = (finalColor * (v_fillColor + lightColor)) + fogColor;";

      if (config.filters && config.filters.length > 0) {
        shader += "if (u_filters > 0) {";
        for (var i = 0; i < config.filters.length; i++) {
          shader += "if ((" + config.filters[i] + " & u_filters) > 0) {";
            switch (config.filters[i]) {
              case WebGl.Stage2D.Filters.GRAYSCALE:
                shader +=
                "fragColor = vec4(" +
                  "vec3(1.0) * ((fragColor.r + (fragColor.g + fragColor.b)) / 3.0), " +
                  "fragColor.a" +
                ");";
              break;
              case WebGl.Stage2D.Filters.SEPIA:
                shader +=
                "fragColor = vec4(" +
                  "vec3(0.874, 0.514, 0.156) * ((fragColor.r + (fragColor.g + fragColor.b)) / 3.0), " +
                  "fragColor.a" +
                ");";
              break;
              case WebGl.Stage2D.Filters.INVERT:
                shader += "fragColor = abs(vec4(fragColor.rgb - 1.0, fragColor.a));";
              break;
              case WebGl.Stage2D.Filters.COLORLIMIT:
                shader +=
                "fragColor = vec4(" +
                  "(floor((fragColor.rgb * 256.0) / 32.0) / 256.0) * 32.0, " +
                  "fragColor.a" +
                ");";
              break;
              case WebGl.Stage2D.Filters.VIGNETTE:
                shader +=
                "fragColor = vec4(" +
                  "fragColor.rgb * (1.0 - sqrt(pow(v_coord.x, 4.0) + pow(v_coord.y, 4.0))), " +
                  "fragColor.a" +
                ");";
              break;
              case WebGl.Stage2D.Filters.RAINBOW:
                shader +=
                "fragColor = vec4(" +
                  "fragColor.rgb + vec3(v_coord.x * 0.15, v_coord.y * 0.15, (v_coord.x - v_coord.y) * 0.15), " +
                  "fragColor.a" +
                ");";
              break;
              case WebGl.Stage2D.Filters.LINES:
                shader += "fragColor += vec4(sin(v_coord.y * 500.0) * 0.2);";
              break;
            }
          shader += "}";
        }
        shader += "}";
      }
      if (config.useMask) shader += "fragColor.a *= maskAlpha;";

      shader +=
    "}" +
  "}";

  return shader;
});
cnst(WebGl.Stage2D, "Filters", {
  "NONE"       : 0,
  "GRAYSCALE"  : 1,
  "SEPIA"      : 2,
  "INVERT"     : 4,
  "COLORLIMIT" : 8,
  "VIGNETTE"   : 16,
  "RAINBOW"    : 32,
  "LINES"      : 64,
});
