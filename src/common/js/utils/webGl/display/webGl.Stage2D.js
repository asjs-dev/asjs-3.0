require("../NameSpace.js");
require("./webGl.Container.js");
require("./webGl.BlendModes.js");

createClass(WebGl, "Stage2D", WebGl.Container, function(_scope, _super) {
  var _webGlUtils  = WebGl.Utils.instance;
  var _matrixUtils = WebGl.MatrixUtils;

  var priv = {};
  cnst(priv, "MAX_BATCH_ITEMS",  10000);

  cnst(priv, "DEFAULT_DOU",  [0, 0]);
  cnst(priv, "DEFAULT_TRI",  [0, 0, 0]);
  cnst(priv, "DEFAULT_QUAD", [0, 0, 0, 0]);

  cnst(priv, "SHADER_LOCATIONS", {
    "a_position"       : "getAttribLocation",
    "a_matrix"         : "getAttribLocation",
    "a_textureMatrix"  : "getAttribLocation",
    "a_textureCrop"    : "getAttribLocation",
    "a_fillColor"      : "getAttribLocation",
    "a_textureId"      : "getAttribLocation",
    "a_textureMaskId"  : "getAttribLocation",
    "a_tintColor"      : "getAttribLocation",
    "a_tintType"       : "getAttribLocation",
    "u_resolution"     : "getUniformLocation",
    "u_textureIndices" : "getUniformLocation",
    "u_lightPositions" : "getUniformLocation",
    "u_lightVolumes"   : "getUniformLocation",
    "u_lightColors"    : "getUniformLocation",
    "u_lightEffects"   : "getUniformLocation",
    "u_fog"            : "getUniformLocation",
    "u_filters"        : "getUniformLocation",
  });

  _scope.fog = {
    r: 1,
    g: 1,
    b: 1,
    v: 0
  };

  var _latestBlendMode = WebGl.BlendModes.NORMAL;

	var _matrixData;
  var _textureIdData;
  var _textureMaskIdData;
	var _textureMatrixData;
  var _textureCropData;
  var _colorData;
  var _tintColorData;
  var _tintTypeData;

	var _matrixBuffer;
  var _textureIdBuffer;
  var _textureMaskIdBuffer;
	var _textureMatrixBuffer;
	var _textureCropBuffer;
  var _colorBuffer;
  var _tintColorBuffer;
	var _tintTypeBuffer;

  var _batchItems = 0;

  var _textureMap = [];

  var _attachedLights = [];
  var _lightPositions;
  var _lightVolumes;
  var _lightColors;
  var _lightEffects;

  var _gl;
  var _webGlBitmap;
  var _program;
  var _locations;

  var _shouldResize = true;

  var _renderTimer;

  var _width;
  var _height;
  var _widthHalf;
  var _heightHalf;

  var _pickedElements = [];
  var _isPickerSet = false;

  var _tempPickerVector  = new Float32Array([0, 0, 0, 1]);
  var _tempInverseMatrix = new Float32Array(16);
  var _tempVector        = new Float32Array(4);

  var _config;

  var _collectLightsFunc;
  var _setMaskDataFunc;
  var _bindMaskBufferFunc;

  override(_scope, _super, "new");
  _scope.new = function(webGlBitmap, vertexShader, fragmentShader, config) {
    _super.new();
    /*
    if (!_webGlUtils.webGlInfo.canShaderRun) {
      return;
    }
    */
    _config = config;

    _webGlBitmap = webGlBitmap;
    _webGlBitmap.addEventListener(WebGl.Bitmap.RESIZE, onResize);

    _gl = _webGlBitmap.getContext();

    _program = _webGlUtils.createProgram(_gl, [
      _webGlUtils.loadShader(_gl, WebGl.Utils.ShaderType.VERTEX_SHADER,   vertexShader(_config)),
      _webGlUtils.loadShader(_gl, WebGl.Utils.ShaderType.FRAGMENT_SHADER, fragmentShader(_config))
    ]);
    _locations = _webGlUtils.getLocationsFor(_gl, _program, priv.SHADER_LOCATIONS);

    _gl.useProgram(_program);

    setBlendMode();

    var positionBuffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ARRAY_BUFFER, positionBuffer);
    _gl.bufferData(_gl.ARRAY_BUFFER, new Uint8Array([0, 0, 1, 0, 1, 1, 0, 1]), _gl.STATIC_DRAW);
    _gl.enableVertexAttribArray(_locations["a_position"]);
    _gl.vertexAttribPointer(_locations["a_position"], 2, _gl.BYTE, false, 0, 0);

    if (_config.showLights) {
      _lightPositions = new Float32Array(WebGl.Stage2D.MAX_LIGHT_SOURCES * 3);
      _lightVolumes   = new Float32Array(WebGl.Stage2D.MAX_LIGHT_SOURCES * 3);
      _lightColors    = new Float32Array(WebGl.Stage2D.MAX_LIGHT_SOURCES * 4);
      _lightEffects   = new Float32Array(WebGl.Stage2D.MAX_LIGHT_SOURCES * 4);
    }
    _collectLightsFunc = _config.showLights
      ? collectLights
      : emptyFunction;

    _matrixData          = new Float32Array(priv.MAX_BATCH_ITEMS * 16);
		_matrixBuffer        = createArrayBuffer(_matrixData,        "a_matrix",        16, 4, 4, _gl.FLOAT, 4);
    _textureIdData       = new Uint8Array(priv.MAX_BATCH_ITEMS);
		_textureIdBuffer     = createArrayBuffer(_textureIdData,     "a_textureId",      1, 1, 1, _gl.BYTE,  0);
    _textureMatrixData   = new Float32Array(priv.MAX_BATCH_ITEMS * 16);
    _textureMatrixBuffer = createArrayBuffer(_textureMatrixData, "a_textureMatrix", 16, 4, 4, _gl.FLOAT, 4);
    _textureCropData     = new Float32Array(priv.MAX_BATCH_ITEMS * 4);
    _textureCropBuffer   = createArrayBuffer(_textureCropData,   "a_textureCrop",    4, 1, 4, _gl.FLOAT, 4);
    _colorData           = new Float32Array(priv.MAX_BATCH_ITEMS * 4);
    _colorBuffer         = createArrayBuffer(_colorData,         "a_fillColor",      4, 1, 4, _gl.FLOAT, 4);
    _tintColorData       = new Float32Array(priv.MAX_BATCH_ITEMS * 4);
    _tintColorBuffer     = createArrayBuffer(_tintColorData,     "a_tintColor",      4, 1, 4, _gl.FLOAT, 4);
    _tintTypeData        = new Uint8Array(priv.MAX_BATCH_ITEMS);
    _tintTypeBuffer      = createArrayBuffer(_tintTypeData,      "a_tintType",       1, 1, 1, _gl.BYTE,  0);

    if (_config.useMask) {
      _textureMaskIdData   = new Uint8Array(priv.MAX_BATCH_ITEMS);
      _textureMaskIdBuffer = createArrayBuffer(_textureMaskIdData, "a_textureMaskId",  1, 1, 1, _gl.BYTE,  0);
    }
    _setMaskDataFunc = _config.useMask
      ? setMaskData
      : emptyFunction;
    _bindMaskBufferFunc = _config.useMask
      ? bindMaskBuffer
      : emptyFunction;

    var textureIndices = new Uint8Array(_webGlUtils.webGlInfo.maxTextureImageUnits);
    var i = textureIndices.length;
    while (i--) textureIndices[i] = i;
    _gl.uniform1iv(_locations["u_textureIndices"], textureIndices);

    resize();
    _scope.setParentColor([1, 1, 1, 1]);
    _scope.filters = WebGl.Stage2D.Filters.NONE;
  }

  set(_scope, "filters", function(f) {
    _gl.uniform1i(_locations["u_filters"], f);
  });

  get(_scope, "bitmap",         function() { return _webGlBitmap; });
  get(_scope, "stage",          function() { return _scope; });
  get(_scope, "isComplete",     function() { return _isComplete; });
  get(_scope, "pickedElements", function() { return _pickedElements.clone(); });

  _scope.render = function() {
    _renderTimer = Date.now();

    _pickedElements.length = 0;

    resize();

    updateFog();

    _collectLightsFunc();

    drawItem(_scope);

    _batchItems > 0 && batchDraw();

    _isPickerSet = false;
  }

  _scope.isLightAttached = function(light) {
    return _attachedLights.has(light);
  }

  _scope.attachLight = function(light) {
    !_scope.isLightAttached(light) &&
    _attachedLights.length < WebGl.Stage2D.MAX_LIGHT_SOURCES &&
    _attachedLights.push(light);
  }

  _scope.detachLight = function(light) {
    _attachedLights.remove(light);
  }

  _scope.setPickerPoint = function(x, y) {
    _isPickerSet = true;

    _tempPickerVector[0] = (x - _widthHalf) * _scope.parentMatrix[0];
    _tempPickerVector[1] = (y - _heightHalf) * _scope.parentMatrix[5];
  }

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _webGlBitmap.removeEventListener(WebGl.Bitmap.RESIZE, onResize);

    priv                   =
    _renderTimer           =
    _webGlUtils            =
    _webGlBitmap           =
    _matrixUtils           =
    _program               =
    _shouldResize          =
    _locations             =
    _matrixData            =
    _textureIdData         =
    _textureMaskIdData     =
    _textureMatrixData     =
    _textureCropData       =
    _colorData             =
    _tintColorData         =
    _tintTypeData          =
    _matrixBuffer          =
    _textureIdBuffer       =
    _textureMaskIdBuffer   =
    _textureMatrixBuffer   =
    _textureCropBuffer     =
    _colorBuffer           =
    _tintColorBuffer       =
    _tintTypeBuffer        =
    _textureMap            =
    _batchItems            =
    _attachedLights        =
    _lightPositions        =
    _lightVolumes          =
    _lightColors           =
    _lightEffects          =
    _width                 =
    _height                =
    _widthHalf             =
    _heightHalf            =
    _tempPickerVector      =
    _tempVector            =
    _tempInverseMatrix     =
    _pickedElements        =
    _isPickerSet           =
    _config                =
    _collectLightsFunc     =
    _setMaskDataFunc       =
    _bindMaskBufferFunc    = null;

    _super.destruct();
  }

  function updateFog() {
    _gl.uniform4fv(_locations["u_fog"], [_scope.fog.r, _scope.fog.g, _scope.fog.b, _scope.fog.v]);
  }

  function collectLights() {
    var light;
    for (var i = 0; i < WebGl.Stage2D.MAX_LIGHT_SOURCES; i++) {
      light = i >= _attachedLights.length || !_attachedLights[i].renderable
        ? null
        : _attachedLights[i];

      _lightPositions.set(light ? light.positionCache : priv.DEFAULT_TRI,  i * 3);
      _lightVolumes.set(light   ? light.volumeCache   : priv.DEFAULT_TRI,  i * 3);
      _lightColors.set(light    ? light.colorCache    : priv.DEFAULT_QUAD, i * 4);
      _lightEffects.set(light   ? light.effectCache   : priv.DEFAULT_QUAD, i * 4);
    }

    light = null;

    _gl.uniform3fv(_locations["u_lightPositions"], _lightPositions);
    _gl.uniform3fv(_locations["u_lightVolumes"],   _lightVolumes);
    _gl.uniform4fv(_locations["u_lightColors"],    _lightColors);
    _gl.uniform4fv(_locations["u_lightEffects"],   _lightEffects);
  }

  function drawItem(item) {
    if (item.renderable) {
      item.updateProperties(_matrixUtils.transform2D);
      if (is(item, WebGl.Container)) drawContainer(item);
      else if (is(item, WebGl.Image)) drawImage(item);
    }
  }

  function drawContainer(item) {
    for (var i = 0; i < item.numChildren; i++) {
      drawItem(item.getChildAt(i));
    }
  }

  function setMaskData(item) {
    _textureMaskIdData[_batchItems] = drawTexture(item.mask);
  }

  function drawImage(item) {
    item.preRender();

    if (_latestBlendMode !== item.blendMode) {
      batchDraw();
      _latestBlendMode = item.blendMode;
    }

    if (
      _isPickerSet &&
      item.interactive &&
      _matrixUtils.isPointInMatrix(_tempPickerVector, item.matrixCache, _tempInverseMatrix, _tempVector)
    ) {
      _pickedElements.push(item);
    }

    _setMaskDataFunc(item);

    var textureMapIndex = drawTexture(item.texture);

    var quadId = _batchItems * 4;
    var matId  = _batchItems * 16;

    _matrixData.set(item.matrixCache, matId);
    _textureIdData[_batchItems] = textureMapIndex;
    _textureMatrixData.set(item.textureMatrixCache, matId);
    _textureCropData.set(item.textureCropCache, quadId);
    _colorData.set(item.parent.colorCache, quadId);
    _tintColorData.set(item.colorCache, quadId);
    _tintTypeData[_batchItems] = item.tintType || 0;

    _batchItems++;
    _batchItems === priv.MAX_BATCH_ITEMS && batchDraw();

    item.postRender(_renderTimer);
  }

  function createArrayBuffer(data, locationId, length, num, size, type, bytes) {
    var buffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ARRAY_BUFFER, buffer);
		_gl.bufferData(_gl.ARRAY_BUFFER, data.byteLength, _gl.DYNAMIC_DRAW);

    attachArrayBuffer(_locations[locationId], buffer, data, length, num, size, type, bytes);

    return buffer;
  }

  function attachArrayBuffer(location, buffer, data, length, num, size, type, bytes) {
    bindArrayBuffer(buffer, data);

		var stride = bytes * length;
    var i = num + 1;
    while (--i) {
			var loc = location + (num - i);
			_gl.enableVertexAttribArray(loc);
      _gl[
        type === _gl.FLOAT
        ? "vertexAttribPointer"
        : "vertexAttribIPointer"
      ](loc, size, type, false, stride, (num - i) * length);
			_gl.vertexAttribDivisor(loc, 1);
		}
	}

  function bindArrayBuffer(buffer, data) {
    _gl.bindBuffer(_gl.ARRAY_BUFFER, buffer);
		_gl.bufferSubData(_gl.ARRAY_BUFFER, 0, data);
  }

  var bindMaskBuffer = bindArrayBuffer.bind(this);

  function batchDraw() {
    _bindMaskBufferFunc(_textureMaskIdBuffer, _textureMaskIdData);

    bindArrayBuffer(_matrixBuffer,        _matrixData);
		bindArrayBuffer(_textureIdBuffer,     _textureIdData);
    bindArrayBuffer(_textureMatrixBuffer, _textureMatrixData);
    bindArrayBuffer(_textureCropBuffer,   _textureCropData);
		bindArrayBuffer(_colorBuffer,         _colorData);
    bindArrayBuffer(_tintColorBuffer,     _tintColorData);
		bindArrayBuffer(_tintTypeBuffer,      _tintTypeData);

    setBlendMode();

    _gl.drawArraysInstanced(_gl.TRIANGLE_FAN, 0, 4, _batchItems);

    _textureMap.length =
    _batchItems = 0;
  }

  function drawTexture(textureInfo) {
    if (!textureInfo) return 0;

    var textureMapIndex = _textureMap.indexOf(textureInfo);
    if (textureMapIndex === -1 || textureInfo.shouldUpdate) {
      if (textureMapIndex === -1 || !textureInfo.shouldUpdate) {
        _textureMap.length === _webGlUtils.webGlInfo.maxTextureImageUnits && batchDraw();
        _textureMap.push(textureInfo);
        textureMapIndex = _textureMap.length - 1;
      }

      _webGlUtils.useTexture(_gl, textureMapIndex, textureInfo);
    }

    return textureMapIndex + 1;
  }

  function setBlendMode() {
    _latestBlendMode.length === 4
      ? _gl.blendFuncSeparate(
          _gl[_latestBlendMode[0]],
          _gl[_latestBlendMode[1]],
          _gl[_latestBlendMode[2]],
          _gl[_latestBlendMode[3]]
        )
      : _gl.blendFunc(
          _gl[_latestBlendMode[0]],
          _gl[_latestBlendMode[1]]
        );
  }

  function resize() {
    if (_shouldResize) {
      _shouldResize = false;

      _width  = _webGlBitmap.bitmapWidth;
      _height = _webGlBitmap.bitmapHeight;

      _widthHalf  = _width * 0.5;
      _heightHalf = _height * 0.5;

      _scope.parentMatrix = _matrixUtils.orthographic(0, _width, _height, 0, -1, 1);

      _gl.uniform2f(_locations["u_resolution"], _width / _height, 96 / _width);
    }
  }

  function onResize() {
    _shouldResize = true;
  }
});
cnst(WebGl.Stage2D, "MAX_LIGHT_SOURCES", 16);
rof(WebGl.Stage2D, "createVertexShader", function(config) {
  var shader = "#version 300 es\n" +
  "precision lowp float;" +

  "in vec4 a_position;" +
  "in mat4 a_matrix;" +
  "in mat4 a_textureMatrix;" +
  "in vec4 a_textureCrop;" +
  "in vec4 a_fillColor;" +
  "in vec4 a_tintColor;" +
  "in int a_textureId;";

  if (config.useMask) shader += "in int a_textureMaskId;";

  shader +=
  "in int a_tintType;" +

  "out vec2 v_texcoord;" +
  "out vec4 v_coord;" +
  "out vec4 v_textureCrop;" +
  "out vec4 v_fillColor;" +
  "out vec4 v_tintColor;" +
  "flat out int v_textureId;";
  if (config.useMask) shader += "flat out int v_textureMaskId;";

  shader +=
  "flat out int v_tintType;" +

  "void main() {" +
    "gl_Position = a_matrix * a_position;" +
    "v_texcoord = (a_textureMatrix * a_position).xy;" +
    "v_coord = gl_Position;" +
    "v_textureCrop = a_textureCrop;" +
    "v_fillColor = a_fillColor;" +
    "v_textureId = a_textureId;";

    if (config.useMask) shader += "v_textureMaskId = a_textureMaskId;";

    shader +=
    "v_tintColor = a_tintColor;" +
    "v_tintType = a_tintType;" +
  "}";

  return shader;
});
rof(WebGl.Stage2D, "createFragmentShader", function(config) {
  var maxTextureImageUnits = WebGl.Utils.instance.webGlInfo.maxTextureImageUnits;
  var maxLightSources = WebGl.Stage2D.MAX_LIGHT_SOURCES;

  var shader = "#version 300 es\n" +
  "precision lowp float;" +

  "in vec4 v_coord;" +
  "in vec2 v_texcoord;" +
  "in vec4 v_textureCrop;" +
  "in vec4 v_fillColor;" +
  "in vec4 v_tintColor;" +
  "flat in int v_textureId;";

  if (config.useMask) shader += "flat in int v_textureMaskId;";

  shader +=
  "flat in int v_tintType;" +

  "uniform sampler2D u_textureIndices[" + maxTextureImageUnits + "];" +

  "uniform vec2 u_resolution;" +
  "uniform int u_filters;" +
  "uniform vec4 u_fog;";

  if (config.showLights) {
    shader +=
    "uniform vec3 u_lightPositions[" + maxLightSources + "];" +
    "uniform vec3 u_lightVolumes[" + maxLightSources + "];" +
    "uniform vec4 u_lightColors[" + maxLightSources + "];" +
    "uniform vec4 u_lightEffects[" + maxLightSources + "];";
  }

  shader += "out vec4 fragColor;";

  shader +=
  "vec2 coordLimit(vec2 coord, vec2 size, vec4 crop) {" +
    "return crop.xy + mod(coord * size, size);" +
  "}";

  if (config.showLights) {
    shader +=
    "vec4 lightValue(vec3 lightPosition, vec3 lightVolume, vec4 lightColor, vec4 lightEffect) {" +
      "vec2 dist = v_coord.xy - lightPosition.xy;" +
      "return lightColor * lightColor.a * max(0.0, min(1.0, 1.0 - sqrt(" +
        "pow(abs(dist.x + (abs(dist.x) * lightEffect.x)), 2.0 * lightEffect.z) * (lightVolume.x / u_resolution.y) + " +
        "pow(abs(dist.y + (abs(dist.y) * lightEffect.y)), 2.0 * lightEffect.w) * (lightVolume.y / u_resolution.x / u_resolution.y)" +
      ")));" +
    "}";
  }

  shader +=
  "void main() {" +
    "vec2 textureCropSize = v_textureCrop.zw - v_textureCrop.xy;" +
    "vec2 coord = coordLimit(v_texcoord, textureCropSize, v_textureCrop);";

    shader += "if (v_textureId == 0) discard;";
    for (var i = 0; i < maxTextureImageUnits; i++) {
      shader += (i > 0 ? " else " : "") +
      "if (v_textureId == " + (i + 1) + ")" +
        "fragColor = texture(u_textureIndices[" + i + "], coord);";
    }

    if (config.useMask) {
      shader +=
      "float maskAlpha = 1.0;" +
      "if (v_textureMaskId > 0) {" +
        "vec2 maskCoord = (v_coord.xy + vec2(1.0, -1.0)) / vec2(2.0, -2.0);";
        for (var i = 0; i < maxTextureImageUnits; i++) {
          shader += (i > 0 ? " else " : "") +
          "if (v_textureMaskId == " + (i + 1) + ")" +
            "maskAlpha = texture(u_textureIndices[" + i + "], maskCoord).a;";
        }
      shader += "}";
    }

    shader +=
    "if (fragColor.a < 0.01) discard;" +
    "if (v_tintType == 0) " +
      "fragColor *= v_tintColor;" +
    "else if (v_tintType == 1 && fragColor.r == fragColor.g && fragColor.r == fragColor.b) " +
      "fragColor *= v_tintColor;" +
    "else if (v_tintType == 2) " +
      "fragColor = vec4((fragColor.rgb * (1.0 - v_tintColor.a)) + (v_tintColor.rgb * v_tintColor.a), fragColor.a);" +

    "vec4 lightColor = vec4(0.0);";

    if (config.showLights) {
      for (var i = 0; i < maxLightSources; i++) {
        shader +=
        "if (u_lightColors[" + i + "].a > 0.0 && u_lightPositions[" + i + "].z <= v_coord.z) {" +
          "lightColor += lightValue(" +
            "u_lightPositions[" + i + "], " +
            "1.0 / abs(u_lightVolumes[" + i + "]), " +
            "u_lightColors[" + i + "], u_lightEffects[" + i + "]" +
          ");" +
        "}";
      }
    }

    shader +=
    "float colorLightMultiply = max(0.0, u_fog.a - lightColor.a);" +
    "float colorMultiply = max(0.0, 1.0 - colorLightMultiply);" +
    "vec4 fogColor = vec4(u_fog.rgb * colorLightMultiply, 0.0);" +
    "vec4 finalColor = vec4(fragColor.rgb * colorMultiply, fragColor.a);" +
    "fragColor = (finalColor * (v_fillColor + lightColor)) + fogColor;" +
    "if (fragColor.a < 0.01) discard;";

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
  shader += "}";

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
