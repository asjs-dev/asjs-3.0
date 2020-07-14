require("../NameSpace.js");
require("./webGl.Container.js");
require("./webGl.BlendModes.js");

createClass(WebGl, "Stage2D", WebGl.Container, function(_scope, _super) {
  var _wglUtils = WebGl.Utils.instance;

  var priv = {};
  cnst(priv, "MAX_BATCH_ITEMS",  10000);

  cnst(priv, "DEFAULT_TRI",  [0, 0, 0]);
  cnst(priv, "DEFAULT_QUAD", [0, 0, 0, 0]);

  cnst(priv, "SHADER_LOCATIONS", {
    "a_position"       : "getAttribLocation",
    "a_matrix"         : "getAttribLocation",
    "a_textureMatrix"  : "getAttribLocation",
    "a_textureCrop"    : "getAttribLocation",
    "a_fillColor"      : "getAttribLocation",
    "a_textureId"      : "getAttribLocation",
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

	var _matrixData        = new Float32Array(priv.MAX_BATCH_ITEMS * 16);
  var _textureIdData     = new Float32Array(priv.MAX_BATCH_ITEMS);
	var _textureMatrixData = new Float32Array(priv.MAX_BATCH_ITEMS * 16);
  var _textureCropData   = new Float32Array(priv.MAX_BATCH_ITEMS * 4);
  var _colorData         = new Float32Array(priv.MAX_BATCH_ITEMS * 4);
  var _tintColorData     = new Float32Array(priv.MAX_BATCH_ITEMS * 4);
  var _tintTypeData      = new Float32Array(priv.MAX_BATCH_ITEMS);

	var _matrixBuffer;
  var _textureIdBuffer;
	var _textureMatrixBuffer;
	var _textureCropBuffer;
  var _colorBuffer;
  var _tintColorBuffer;
	var _tintTypeBuffer;

  var _batchItems = 0;

  var _textureMap = [];

  var _attachedLights   = [];
  var _lightPositions = new Float32Array(WebGl.Stage2D.MAX_LIGHT_SOURCES * 3);
  var _lightVolumes   = new Float32Array(WebGl.Stage2D.MAX_LIGHT_SOURCES * 3);
  var _lightColors    = new Float32Array(WebGl.Stage2D.MAX_LIGHT_SOURCES * 4);
  var _lightEffects   = new Float32Array(WebGl.Stage2D.MAX_LIGHT_SOURCES * 4);

  var _gl;
  var _webGlBitmap;
  var _program;
  var _locations;

  var _shouldResize = true;

  var _renderTimer;

  var _width;
  var _height;

  var _pickedElements = [];
  var _isPickerSet         = false;

  var _tempPickerVector  = new Float32Array([0, 0, 0, 1]);
  var _tempInverseMatrix = new Float32Array(16);
  var _tempVector        = new Float32Array(4);


  override(_scope, _super, "new");
  _scope.new = function(webGlBitmap, vertexShader, fragmentShader) {
    _super.new();
    _webGlBitmap = webGlBitmap;
    _webGlBitmap.addEventListener(WebGl.Bitmap.RESIZE, onResize);

    _gl = _webGlBitmap.getContext();

    _program = _wglUtils.createProgram(_gl, [
      _wglUtils.loadShader(_gl, WebGl.Utils.ShaderType.VERTEX_SHADER,   vertexShader),
      _wglUtils.loadShader(_gl, WebGl.Utils.ShaderType.FRAGMENT_SHADER, fragmentShader)
    ]);
    _locations = _wglUtils.getLocationsFor(_gl, _program, priv.SHADER_LOCATIONS);

    _gl.useProgram(_program);

    setBlendMode();

    var positionBuffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ARRAY_BUFFER, positionBuffer);
    _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), _gl.STATIC_DRAW);
    _gl.enableVertexAttribArray(_locations["a_position"]);
    _gl.vertexAttribPointer(_locations["a_position"], 2, _gl.FLOAT, false, 0, 0);

		_matrixBuffer        = createArrayBuffer(_matrixData,        "a_matrix",        16, 4, 4);
		_textureIdBuffer     = createArrayBuffer(_textureIdData,     "a_textureId",      1, 1, 1);
    _textureMatrixBuffer = createArrayBuffer(_textureMatrixData, "a_textureMatrix", 16, 4, 4);
    _textureCropBuffer   = createArrayBuffer(_textureCropData,   "a_textureCrop",    4, 1, 4);
    _colorBuffer         = createArrayBuffer(_colorData,         "a_fillColor",      4, 1, 4);
    _tintColorBuffer     = createArrayBuffer(_tintColorData,     "a_tintColor",      4, 1, 4);
    _tintTypeBuffer      = createArrayBuffer(_tintTypeData,      "a_tintType",       1, 1, 1);

    var textureIndices = new Int8Array(_wglUtils.webGlInfo.maxTextureImageUnits);
    var i = textureIndices.length;
    while (i--) textureIndices[i] = i;
    _gl.uniform1iv(_locations["u_textureIndices"], textureIndices);

    resize();
    _scope.setParentColor([1, 1, 1, 1]);
    _scope.filters = WebGl.Stage2D.FILTERS.NONE;
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
    collectLights();
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

    _tempPickerVector[0] = (x - (_width * 0.5)) * _scope.parentMatrix[0];
    _tempPickerVector[1] = (y - (_height * 0.5)) * _scope.parentMatrix[5];
  }

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _webGlBitmap.removeEventListener(WebGl.Bitmap.RESIZE, onResize);

    priv                   =
    _renderTimer           =
    _wglUtils              =
    _webGlBitmap           =
    _program               =
    _shouldResize          =
    _locations             =
    _matrixData            =
    _textureIdData         =
    _textureMatrixData     =
    _textureCropData       =
    _colorData             =
    _tintColorData         =
    _tintTypeData          =
    _matrixBuffer          =
    _textureIdBuffer       =
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
    _tempPickerVector      =
    _tempVector            =
    _tempInverseMatrix     =
    _pickedElements        =
    _isPickerSet           = null;

    _super.destruct();
  }

  function updateFog() {
    _gl.uniform4fv(_locations["u_fog"], [_scope.fog.r, _scope.fog.g, _scope.fog.b, _scope.fog.v]);
  }

  function collectLights() {
    var id;
    var quadId;
    for (var i = 0; i < WebGl.Stage2D.MAX_LIGHT_SOURCES; i++) {
      id = i * 3;
      quadId = i * 4;
      if (i >= _attachedLights.length || !_attachedLights[i].renderable) {
        _lightPositions.set(priv.DEFAULT_TRI,  id);
        _lightVolumes.set(priv.DEFAULT_TRI,    id);
        _lightColors.set(priv.DEFAULT_QUAD,   quadId);
        _lightEffects.set(priv.DEFAULT_QUAD, quadId);
      } else {
        var light = _attachedLights[i];
        _lightPositions.set(light.positionCache, id);
        _lightVolumes.set(light.volumeCache,     id);
        _lightColors.set(light.colorCache,       quadId);
        _lightEffects.set(light.effectCache,     quadId);
      }
    }

    _gl.uniform3fv(_locations["u_lightPositions"], _lightPositions);
    _gl.uniform3fv(_locations["u_lightVolumes"],   _lightVolumes);
    _gl.uniform4fv(_locations["u_lightColors"],    _lightColors);
    _gl.uniform4fv(_locations["u_lightEffects"],   _lightEffects);
  }

  function drawItem(item) {
    if (item.renderable) {
      item.updateProperties(m4.transform2D);
      if (is(item, WebGl.Container)) drawContainer(item);
      else if (is(item, WebGl.Image)) drawImage(item);
    }
  }

  function drawContainer(item) {
    for (var i = 0; i < item.numChildren; i++) drawItem(item.getChildAt(i));
  }

  var mp = [0, 0];
  function drawImage(item) {
    item.preRender();

    if (_latestBlendMode !== item.blendMode) {
      batchDraw();
      _latestBlendMode = item.blendMode;
    }

    if (_isPickerSet && item.interactive && m4.isPointInMatrix(_tempPickerVector, item.matrixCache, _tempInverseMatrix, _tempVector)) {
      _pickedElements.push(item);
    }

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
    if (_batchItems === priv.MAX_BATCH_ITEMS) batchDraw();

    item.postRender(_renderTimer);
  }

  function createArrayBuffer(data, locationId, length, num, items) {
    var buffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ARRAY_BUFFER, buffer);
		_gl.bufferData(_gl.ARRAY_BUFFER, data.byteLength, _gl.DYNAMIC_DRAW);

    attachArrayBuffer(_locations[locationId], buffer, data, length, num, items);

    return buffer;
  }

  function attachArrayBuffer(location, buffer, data, length, num, items) {
    bindArrayBuffer(buffer, data);

		var bytes = 4 * length;
    var i = num + 1;
    while (--i) {
			var loc = location + (num - i);
			_gl.enableVertexAttribArray(loc);
			_gl.vertexAttribPointer(loc, items, _gl.FLOAT, false, bytes, (num - i) * length);
			_gl.vertexAttribDivisor(loc, 1);
		}
	}

  function bindArrayBuffer(buffer, data) {
    _gl.bindBuffer(_gl.ARRAY_BUFFER, buffer);
		_gl.bufferSubData(_gl.ARRAY_BUFFER, 0, data);
  }

  function batchDraw() {
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
    var textureMapIndex = _textureMap.indexOf(textureInfo);
    if (textureMapIndex === -1) {
      _textureMap.length === _wglUtils.webGlInfo.maxTextureImageUnits && batchDraw();
      _textureMap.push(textureInfo);
      textureMapIndex = _textureMap.length - 1;

      _gl.activeTexture(_gl.TEXTURE0 + textureMapIndex);
      _gl.bindTexture(textureInfo.target, textureInfo.texture);
    }

    return textureMapIndex;
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

      _scope.parentMatrix = m4.orthographic(0, _width, _height, 0, -1, 1);

      _gl.uniform2f(_locations["u_resolution"], _width / _height, 96 / _width);
    }
  }

  function onResize() {
    _shouldResize = true;
  }
});
cnst(WebGl.Stage2D, "MAX_LIGHT_SOURCES", 16);
rof(WebGl.Stage2D, "createVertexShader", function() {
  return "#version 300 es\n" +
    "precision lowp float;" +

    "in vec4 a_position;" +
    "in mat4 a_matrix;" +
    "in mat4 a_textureMatrix;" +
    "in vec4 a_textureCrop;" +
    "in vec4 a_fillColor;" +
    "in float a_textureId;" +
    "in vec4 a_tintColor;" +
    "in float a_tintType;" +

    "out vec2 v_texcoord;" +
    "out vec4 v_coord;" +

    "out vec4 v_textureCrop;" +
    "out vec4 v_fillColor;" +
    "out vec4 v_tintColor;" +
    "flat out int v_textureId;" +
    "flat out int v_tintType;" +

    "void main() {" +
      "gl_Position   = a_matrix * a_position;" +
      "v_texcoord    = (a_textureMatrix * a_position).xy;" +
      "v_coord       = gl_Position;" +

      "v_textureCrop = a_textureCrop;" +
      "v_fillColor   = a_fillColor;" +
      "v_textureId   = int(a_textureId);" +
      "v_tintColor   = a_tintColor;" +
      "v_tintType    = int(a_tintType);" +
    "}";
});
rof(WebGl.Stage2D, "createFragmentShader", function(showLights, filters) {
  var maxTextureImageUnits = WebGl.Utils.instance.webGlInfo.maxTextureImageUnits;
  var maxLightSources = WebGl.Stage2D.MAX_LIGHT_SOURCES;
  var shader = "#version 300 es\n" +
  "precision lowp float;" +

  "in vec4 v_coord;" +
  "in vec2 v_texcoord;" +

  "in vec4 v_textureCrop;" +
  "in vec4 v_fillColor;" +
  "in vec4 v_tintColor;" +
  "flat in int v_textureId;" +
  "flat in int v_tintType;" +

  "uniform vec2 u_resolution;" +

  "uniform int u_filters;" +

  "uniform sampler2D u_textureIndices[" + maxTextureImageUnits + "];" +

  "uniform vec4 u_fog;";

  if (showLights) {
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

  if (showLights) {
    shader +=
      "vec4 lightValue(vec3 lightPosition, vec3 lightVolume, vec4 lightColor, vec4 lightEffect) {" +
        "vec2 dist = v_coord.xy - lightPosition.xy;" +
        "return lightColor * lightColor.a * max(0.0, min(1.0, 1.0 - sqrt(" +
          "pow(dist.x + (abs(dist.x) * lightEffect.x), 2.0 * lightEffect.z) * (lightVolume.x / u_resolution.y) + " +
          "pow(dist.y + (abs(dist.y) * lightEffect.y), 2.0 * lightEffect.w) * (lightVolume.y / u_resolution.x / u_resolution.y)" +
        ")));" +
      "}";
  }

  shader +=
  "void main() {" +
    "int index = int(v_textureId);" +
    "vec2 textureCropSize = v_textureCrop.zw - v_textureCrop.xy;" +
    "vec2 coord = coordLimit(v_texcoord, textureCropSize, v_textureCrop);";

  for (var i = 0; i < maxTextureImageUnits; i++) {
    shader += (i > 0 ? " else " : "") +
      "if (index == " + i + ") " +
        "fragColor = texture(u_textureIndices[" + i + "], coord);";
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

  if (showLights) {
    for (var i = 0; i < maxLightSources; i++) {
      shader +=
        "if (u_lightColors[" + i + "].a > 0.0 && u_lightPositions[" + i + "].z <= v_coord.z) {" +
          "lightColor += lightValue(u_lightPositions[" + i + "], 1.0 / abs(u_lightVolumes[" + i + "]), u_lightColors[" + i + "], u_lightEffects[" + i + "]);" +
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

  if (filters && filters.length > 0) {
    shader += "if (u_filters > 0) {";
    for (var i = 0; i < filters.length; i++) {
      shader += "if ((" + filters[i] + " & u_filters) > 0) {";
        switch (filters[i]) {
          case WebGl.Stage2D.FILTERS.GRAYSCALE:
            shader += "fragColor = vec4(vec3(1.0) * ((fragColor.r + (fragColor.g + fragColor.b)) / 3.0), fragColor.a);";
          break;
          case WebGl.Stage2D.FILTERS.SEPIA:
            shader += "fragColor = vec4(vec3(0.874, 0.514, 0.156) * ((fragColor.r + (fragColor.g + fragColor.b)) / 3.0), fragColor.a);";
          break;
          case WebGl.Stage2D.FILTERS.INVERT:
            shader += "fragColor = abs(vec4(fragColor.rgb - 1.0, fragColor.a));";
          break;
          case WebGl.Stage2D.FILTERS.COLORLIMIT:
            shader += "fragColor = vec4((floor((fragColor.rgb * 256.0) / 32.0) / 256.0) * 32.0, fragColor.a);";
          break;
          case WebGl.Stage2D.FILTERS.VIGNETTE:
            shader += "fragColor = vec4(fragColor.rgb * (1.0 - sqrt(pow(v_coord.x, 4.0) + pow(v_coord.y, 4.0))), fragColor.a);";
          break;
          case WebGl.Stage2D.FILTERS.RAINBOW:
            shader += "fragColor = vec4(fragColor.rgb + vec3(v_coord.x * 0.15, v_coord.y * 0.15, (v_coord.x - v_coord.y) * 0.15), fragColor.a);";
          break;
          case WebGl.Stage2D.FILTERS.LINES:
            shader += "fragColor += vec4(sin(v_coord.y * 500.0) * 0.2);";
          break;
        }
      shader += "}";
    }
    shader += "}";
  }
  shader += "}";

  return shader;
});
cnst(WebGl.Stage2D, "FILTERS", {
  "NONE"       : 0,
  "GRAYSCALE"  : 1,
  "SEPIA"      : 2,
  "INVERT"     : 4,
  "COLORLIMIT" : 8,
  "VIGNETTE"   : 16,
  "RAINBOW"    : 32,
  "LINES"      : 64,
});
