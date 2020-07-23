require("../NameSpace.js");
require("./webGl.Container.js");
require("./webGl.BlendModes.js");

createClass(WebGl, "Stage2D", WebGl.Container, function(_scope, _super) {
  _super.protected.parent = _scope;

  var _webGlUtils  = WebGl.Utils.instance;
  var _matrixUtils = WebGl.Matrix3;

  var priv = {};
  cnst(priv, "MAX_BATCH_ITEMS",  10000);

  cnst(priv, "DEFAULT_DUO",  [0, 0]);
  cnst(priv, "DEFAULT_QUAD", [0, 0, 0, 0]);

  cnst(priv, "SHADER_LOCATIONS", {
    "a_position"       : "getAttribLocation",
    "a_matrix"         : "getAttribLocation",
    "a_texMatrix"      : "getAttribLocation",
    "a_texCrop"        : "getAttribLocation",
    "a_fillColor"      : "getAttribLocation",
    "a_tintColor"      : "getAttribLocation",
    "a_effects"        : "getAttribLocation",
    "u_resolution"     : "getUniformLocation",
    "u_texIds"         : "getUniformLocation",
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

  var _transformFunction = _matrixUtils.transform;

	var _matrixData;
	var _textureMatrixData;
  var _textureCropData;
  var _colorData;
  var _tintColorData;
  var _effectData;
  var _effectLength;

  var _matrixBuffer;
  var _textureMatrixBuffer;
	var _textureCropBuffer;
  var _colorBuffer;
  var _tintColorBuffer;
  var _effectBuffer;

  var _batchItems = 0;

  var _textureMap = [];
  var _textureIds = [];

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

  var _tempPickerVector  = new Float32Array([0, 0, 1]);
  var _tempInverseMatrix = new Float32Array(9);
  var _tempVector        = new Float32Array(3);

  var _config;

  var _collectLightsFunc;
  var _setMaskDataFunc;

  override(_scope, _super, "new");
  _scope.new = function(webGlBitmap, vertexShader, fragmentShader, config) {
    _super.new();

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
      _lightPositions = new Float32Array(WebGl.Stage2D.MAX_LIGHT_SOURCES * 2);
      _lightVolumes   = new Float32Array(WebGl.Stage2D.MAX_LIGHT_SOURCES * 2);
      _lightColors    = new Float32Array(WebGl.Stage2D.MAX_LIGHT_SOURCES * 4);
      _lightEffects   = new Float32Array(WebGl.Stage2D.MAX_LIGHT_SOURCES * 4);
    }
    _collectLightsFunc = _config.showLights
      ? collectLights
      : emptyFunction;

    _matrixData          = new Float32Array(priv.MAX_BATCH_ITEMS * 9);
		_matrixBuffer        = createArrayBuffer(_matrixData,        "a_matrix",    9, 3, 3, _gl.FLOAT, 4);
    _textureMatrixData   = new Float32Array(priv.MAX_BATCH_ITEMS * 9);
    _textureMatrixBuffer = createArrayBuffer(_textureMatrixData, "a_texMatrix", 9, 3, 3, _gl.FLOAT, 4);
    _textureCropData     = new Float32Array(priv.MAX_BATCH_ITEMS * 4);
    _textureCropBuffer   = createArrayBuffer(_textureCropData,   "a_texCrop",   4, 1, 4, _gl.FLOAT, 4);
    _colorData           = new Float32Array(priv.MAX_BATCH_ITEMS * 4);
    _colorBuffer         = createArrayBuffer(_colorData,         "a_fillColor", 4, 1, 4, _gl.FLOAT, 4);
    _tintColorData       = new Float32Array(priv.MAX_BATCH_ITEMS * 4);
    _tintColorBuffer     = createArrayBuffer(_tintColorData,     "a_tintColor", 4, 1, 4, _gl.FLOAT, 4);

    _effectLength = (_config.useMask ? 3 : 2);
    _effectData   = new Uint8Array(priv.MAX_BATCH_ITEMS * _effectLength);
    _effectBuffer = createArrayBuffer(_effectData, "a_effects", _effectLength, 1, _effectLength, _gl.BYTE, 0);

    _setMaskDataFunc = _config.useMask
      ? setMaskData
      : emptyFunction;

    resize();
    _scope.parentColor = [1, 1, 1, 1];
    _scope.filters = WebGl.Stage2D.Filters.NONE;
  }

  prop(_scope, "parent", { set: emptyFunction });

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
    _tempPickerVector[1] = (y - _heightHalf) * _scope.parentMatrix[4];
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
    _textureMatrixData     =
    _textureCropData       =
    _colorData             =
    _tintColorData         =
    _effectData            =
    _matrixBuffer          =
    _textureMatrixBuffer   =
    _textureCropBuffer     =
    _colorBuffer           =
    _tintColorBuffer       =
    _effectBuffer          =
    _textureMap            =
    _textureIds            =
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
    _transformFunction     = null;

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

      _lightPositions.set(light ? light.positionCache : priv.DEFAULT_DUO,  i * 2);
      _lightVolumes.set(light   ? light.volumeCache   : priv.DEFAULT_DUO,  i * 2);
      _lightColors.set(light    ? light.colorCache    : priv.DEFAULT_QUAD, i * 4);
      _lightEffects.set(light   ? light.effectCache   : priv.DEFAULT_QUAD, i * 4);
    }

    light = null;

    _gl.uniform2fv(_locations["u_lightPositions"], _lightPositions);
    _gl.uniform2fv(_locations["u_lightVolumes"],   _lightVolumes);
    _gl.uniform4fv(_locations["u_lightColors"],    _lightColors);
    _gl.uniform4fv(_locations["u_lightEffects"],   _lightEffects);
  }

  function drawItem(item) {
    if (item.renderable) {
      item.preRender(_renderTimer);

      item.update(_transformFunction);

      if (is(item, WebGl.Container)) drawContainer(item);
      else if (is(item, WebGl.Image)) drawImage(item);

      item.postRender(_renderTimer);
    }
  }

  function drawContainer(item) {
    for (var i = 0; i < item.numChildren; i++) {
      drawItem(item.getChildAt(i));
    }
  }

  function setMaskData(item) {
    _effectData[_batchItems * _effectLength + 2] = drawTexture(item.mask);
  }

  function drawImage(item) {
    if (_latestBlendMode !== item.blendMode) {
      batchDraw();
      _latestBlendMode = item.blendMode;
    }

    if (
      _isPickerSet &&
      item.interactive &&
      _matrixUtils.isPointInMatrix(_tempPickerVector, item.matrixCache, _tempInverseMatrix, _tempVector)
    ) _pickedElements.push(item);

    _setMaskDataFunc(item);

    var textureMapIndex = drawTexture(item.texture);

    var quadId   = _batchItems * 4;
    var matId    = _batchItems * 9;
    var effectId = _batchItems * _effectLength;

    _matrixData.set(item.matrixCache, matId);
    _textureMatrixData.set(item.textureMatrixCache, matId);
    _textureCropData.set(item.textureCropCache, quadId);
    _colorData.set(item.parent.colorCache, quadId);
    _tintColorData.set(item.colorCache, quadId);
    _effectData.set([textureMapIndex, item.tintType], effectId);

    _batchItems++;
    _batchItems === priv.MAX_BATCH_ITEMS && batchDraw();
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
      ](loc, size, type, false, stride, (num - i) * bytes * size);
			_gl.vertexAttribDivisor(loc, 1);
		}
	}

  function bindArrayBuffer(buffer, data) {
    _gl.bindBuffer(_gl.ARRAY_BUFFER, buffer);
		_gl.bufferSubData(_gl.ARRAY_BUFFER, 0, data);
  }

  function batchDraw() {
    _gl.uniform1iv(_locations["u_texIds"], new Uint8Array(_textureIds));

    bindArrayBuffer(_matrixBuffer,        _matrixData);
    bindArrayBuffer(_textureMatrixBuffer, _textureMatrixData);
    bindArrayBuffer(_textureCropBuffer,   _textureCropData);
		bindArrayBuffer(_colorBuffer,         _colorData);
    bindArrayBuffer(_tintColorBuffer,     _tintColorData);
    bindArrayBuffer(_effectBuffer,        _effectData);

    setBlendMode();

    _gl.drawArraysInstanced(_gl.TRIANGLE_FAN, 0, 4, _batchItems);

    _textureMap.length =
    _textureIds.length =
    _batchItems = 0;
  }

  function drawTexture(textureInfo) {
    if (!textureInfo) return 0;

    var textureMapIndex = _textureMap.indexOf(textureInfo);
    var isIndexUnset = textureMapIndex === -1;
    if (isIndexUnset || textureInfo.shouldUpdate) {
      if (isIndexUnset || !textureInfo.shouldUpdate) {
        _textureMap.length === _webGlUtils.webGlInfo.maxTextureImageUnits && batchDraw();
        _textureMap.push(textureInfo);
        textureMapIndex = _textureMap.length - 1;
        _textureIds.push(textureMapIndex);
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

      _scope.parentMatrix = _matrixUtils.projection(_width, _height);

      _gl.uniform2f(_locations["u_resolution"], _width / _height, 100 / _width);

      _scope.updateProps();
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

  "in vec2 a_position;" +
  "in mat3 a_matrix;" +
  "in mat3 a_texMatrix;" +
  "in vec4 a_texCrop;" +
  "in vec4 a_fillColor;" +
  "in vec4 a_tintColor;" +
  "in ivec" + (config.useMask ? "3" : "2") + " a_effects;";

  shader +=
  "out vec2 v_texCoord;" +
  "out vec4 v_coord;" +
  "out vec4 v_texCrop;" +
  "out vec2 v_texCropSize;" +
  "out vec4 v_fillColor;" +
  "out vec4 v_tintColor;" +
  "flat out int v_texId;" +
  "flat out int v_tintType;";

  if (config.useMask) shader += "flat out int v_maskTexId;";

  shader +=
  "void main() {" +
    "vec3 pos = vec3(a_position, 1.0);" +
    "gl_Position = vec4((a_matrix * pos).xy, 0.0, 1.0);" +
    "v_texCoord = (a_texMatrix * pos).xy;" +
    "v_coord = gl_Position;" +
    "v_texCrop = a_texCrop;" +
    "v_texCropSize = v_texCrop.zw - v_texCrop.xy;" +
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
  var maxLightSources = WebGl.Stage2D.MAX_LIGHT_SOURCES;

  var shader = "#version 300 es\n" +
  "precision lowp float;" +

  "in vec4 v_coord;" +
  "in vec2 v_texCoord;" +
  "in vec4 v_texCrop;" +
  "in vec2 v_texCropSize;" +
  "in vec4 v_fillColor;" +
  "in vec4 v_tintColor;" +
  "flat in int v_texId;" +
  "flat in int v_tintType;";

  if (config.useMask) shader += "flat in int v_maskTexId;";

  shader +=
  "uniform sampler2D u_texIds[" + maxTextureImageUnits + "];" +

  "uniform vec2 u_resolution;" +
  "uniform int u_filters;" +
  "uniform vec4 u_fog;";

  if (config.showLights) {
    shader +=
    "uniform vec2 u_lightPositions[" + maxLightSources + "];" +
    "uniform vec2 u_lightVolumes[" + maxLightSources + "];" +
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
    "vec4 lightValue(vec2 lightPosition, vec2 lightVolume, vec4 lightColor, vec4 lightEffect) {" +
      "vec2 dist = v_coord.xy - lightPosition;" +
      "return lightColor * lightColor.a * max(0.0, min(1.0, 1.0 - sqrt(" +
        "pow(abs(dist.x + (abs(dist.x) * lightEffect.x)), 2.0 * lightEffect.z) * (lightVolume.x / u_resolution.y) + " +
        "pow(abs(dist.y + (abs(dist.y) * lightEffect.y)), 2.0 * lightEffect.w) * (lightVolume.y / u_resolution.x / u_resolution.y)" +
      ")));" +
    "}";
  }

  shader +=
  "void main() {" +
    "if (v_texId == 0) discard;";

    if (config.useMask) {
      shader +=
      "float maskAlpha = 1.0;" +
      "if (v_maskTexId > 0) {" +
        "vec2 maskCoord = (v_coord.xy + vec2(1.0, -1.0)) / vec2(2.0, -2.0);" +
        "bool isMaskTexFound = false;";
        for (var i = 0; i < maxTextureImageUnits; i++) {
          shader += (i > 0 ? " else " : "") +
          "if (" + (i > 0 ? "!isMaskTexFound && " : "") + "v_maskTexId == " + (i + 1) + ") {" +
            "maskAlpha = texture(u_texIds[" + i + "], maskCoord).a;" +
            "isMaskTexFound = true;" +
          "}";
        }
      shader += "}" +
      "if (maskAlpha == 0.0) discard;";
    }

    shader +=
    "vec2 coord = coordLimit(v_texCoord, v_texCropSize, v_texCrop);" +
    "bool isTexFound = false;";
    for (var i = 0; i < maxTextureImageUnits; i++) {
      shader += (i > 0 ? " else " : "") +
      "if (" + (i > 0 ? "!isTexFound && " : "") + "v_texId == " + (i + 1) + ") {" +
        "fragColor = texture(u_texIds[" + i + "], coord);" +
        "isTexFound = true;" +
      "}";
    }

    shader +=
    "if (fragColor.a == 0.0) discard;" +
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
        "if (u_lightColors[" + i + "].a > 0.0) {" +
          "lightColor += lightValue(" +
            "u_lightPositions[" + i + "], " +
            "1.0 / abs(u_lightVolumes[" + i + "]), " +
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
    "fragColor = (finalColor * (v_fillColor + lightColor)) + fogColor;" +
    "if (fragColor.a == 0.0) discard;";

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
