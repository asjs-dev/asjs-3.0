ASJS.import("com/asjs/display/asjs.DisplayObject.js");
ASJS.import("com/asjs/display/asjs.Image.js");
ASJS.import("com/asjs/display/bitmap/utils/asjs.Color.js");
ASJS.import("com/asjs/geom/asjs.GeomUtils.js");

ASJS.Bitmap = createClass(
"Bitmap",
ASJS.DisplayObject,
function(_scope, _super) {
  var priv = {};
  
  cnst(priv, "TARGET_FILL", "targetFill");
  cnst(priv, "TARGET_STROKE", "targetStroke");
  
  var _filtersReady = true;
  var _drawLine     = false;
  var _drawFill     = false;
  var _keepOriginal = true;
  var _context;
  var _bitmapFilters;
  var _original;
  
  _scope.new = function(bitmapWidth, bitmapHeight) {
    _super.new("canvas");
    if (!getContext()) throw new Error("ASJS.Bitmap (canvas) is not supported in your browser!");
    _scope.setBitmapSize(bitmapWidth, bitmapHeight);
  }
  
  prop(_scope, "keepOriginal", {
    get: function() { return _keepOriginal; },
    set: function(v) { _keepOriginal = v; }
  });

  prop(_scope, "bitmapFilters", {
    get: function() { return _bitmapFilters; },
    set: function(v) {
      _bitmapFilters = v;
      executeFilters();
    }
  });

  prop(_scope, "bitmapWidth", {
    get: function() { return _scope.el.width; },
    set: function(v) { _scope.setAttr("width", Math.max(1, v || 1)); }
  });

  prop(_scope, "bitmapHeight", {
    get: function() { return _scope.el.height; },
    set: function(v) { _scope.setAttr("height", Math.max(1, v || 1)); }
  });

  prop(_scope, "blendMode", {
    get: function() { return getContext().globalCompositeOperation; },
    set: function(v) { getContext().globalCompositeOperation = v; }
  });

  prop(_scope, "globalAlpha", {
    get: function() { return getContext().globalAlpha; },
    set: function(v) { getContext().globalAlpha = v; }
  });
  
  _scope.beginLineColorStyle = function(size, rgb, alpha, miterLimit, lineJoin, lineCap) {
    beginPath();
    setLineStyle(size, miterLimit, lineJoin, lineCap);
    beginColorFill(priv.TARGET_STROKE, rgb, alpha);
  }

  _scope.beginLineGradientStyle = function(size, type, gradientParams, colors, lineMitter, lineJoin, lineCap) {
    beginPath();
    setLineStyle(size, miterLimit, lineJoin, lineCap);
    beginGradientFill(priv.TARGET_STROKE, type, gradientParams, colors);
  }

  _scope.beginLinePatternStyle = function(size, image, repeat, lineMitter, lineJoin, lineCap) {
    beginPath();
    setLineStyle(size, miterLimit, lineJoin, lineCap);
    beginPatternFill(priv.TARGET_STROKE, image, repeat);
  }

  _scope.beginColorFill = function(rgb, alpha) {
    beginFill();
    beginColorFill(priv.TARGET_FILL, rgb, alpha);
  }

  _scope.beginGradientFill = function(type, gradientParams, colors) {
    beginFill();
    beginGradientFill(priv.TARGET_FILL, type, gradientParams, colors);
  }

  _scope.beginPatternFill = function(image, repeat) {
    beginFill();
    beginPatternFill(priv.TARGET_FILL, image, repeat);
  }

  _scope.translate = function(x, y) {
    getContext().translate(x, y);
  }

  _scope.rotate = function(v) {
    getContext().rotate(v * ASJS.GeomUtils.THETA);
  }

  _scope.scale = function(w, h) {
    getContext().scale(w, h);
  }

  _scope.transform = function(matrix) {
    getContext().transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
  }

  _scope.endLineStyle = function() {
    var ctx = getContext();
    if (_drawLine) ctx.stroke();
    _drawLine = false;
  }

  _scope.endFill = function() {
    var ctx = getContext();
    getContext().closePath();
    if (_drawFill) ctx.fill();
    _drawFill = false;
  }

  _scope.moveTo = function(x, y) {
    getContext().moveTo(x, y);
  }

  _scope.lineTo = function(x, y) {
    getContext().lineTo(x, y);
  }
  
  _scope.quadraticCurveTo = function(cp1x, cp1y, x, y) {
    getContext().quadraticCurveTo(cp1x, cp1y, x, y);
  }
  
  _scope.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
    getContext().bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  }

  _scope.drawRect = function(x, y, w, h) {
    var ctx = getContext();
    if (_drawFill) ctx.fillRect(x, y, w, h); 
    if (_drawLine) ctx.strokeRect(x, y, w, h);
  }

  _scope.drawCircle = function(x, y, r) {
    _scope.drawArc(x, y, r, 0, 2 * Math.PI);
  }

  _scope.drawArc = function(x, y, r, begin, end, counterclockwise) {
    getContext().arc(x, y, r, begin, end, counterclockwise);
  }

  _scope.drawHTML = function(v) {
    try {
      rasterizeHTML.drawHTML(v, _scope.el);
    } catch(e) {
      throw new Error("Missing: http://www.github.com/cburgmer/rasterizeHTML.js");
    }
  }

  _scope.drawImage = function(image, sx, sy, sw, sh, x, y, w, h) {
    try {
      getContext().drawImage(image.el, sx, sy, sw, sh, x, y, w, h);
    } catch (e) {}
  }

  _scope.textStyle = function(font, align, baseline) {
    var ctx = getContext();
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
  }

  _scope.drawText = function(text, x, y) {
    var ctx = getContext();
    if (_drawFill) ctx.fillText(text, x, y);
    if (_drawLine) ctx.strokeText(text, x, y);
  }

  _scope.measureText = function(text) {
    return getContext().measureText(text);
  }

  _scope.clearRect = function(x, y, w, h) {
    getContext().clearRect(x, y, w, h);
  }

  _scope.getDataUrl = function(type, encoderOptions) {
    return _scope.el.toDataURL(type, encoderOptions);
  }

  _scope.getColorRgb = function(x, y) {
    var color = _scope.getImageData(x, y, 1, 1);
    return {
      r: color.data[ 0 ],
      g: color.data[ 1 ],
      b: color.data[ 2 ],
      a: color.data[ 3 ]
    };
  }

  _scope.setColor = function(x, y) {
    _scope.drawRect(x, y, 1, 1);
  }

  _scope.getImageData = function(x, y, w, h) {
    return getContext().getImageData(x, y, w, h);
  }

  _scope.putImageData = function(imageData, x, y) {
    getContext().putImageData(imageData, x, y);
  }

  _scope.merge = function(bitmap, srcX, srcY, srcW, srcH, x, y) {
    _scope.putImageData(bitmap.getImageData(srcX, srcY, srcW, srcH), x, y);
  }

  _scope.destroy = function() {
    _scope.clearRect(0, 0, _scope.bitmapWidth, _scope.bitmapHeight);
    _scope.setBitmapSize(1, 1);
    if (_original) _original = null;
  }

  _scope.setBitmapSize = function(width, height) {
    _scope.bitmapWidth = width;
    _scope.bitmapHeight = height;
  }

  _scope.clone = function() {
    var bmp = new ASJS.Bitmap(_scope.bitmapWidth, _scope.bitmapHeight);
      bmp.setSize(_scope.bitmapWidth, _scope.bitmapHeight);
      bmp.drawImage(_scope, 0, 0, _scope.bitmapWidth, _scope.bitmapHeight, 0, 0, _scope.bitmapWidth, _scope.bitmapHeight);
    return bmp;
  }

  _scope.getOriginal = function() {
    var bmp = new ASJS.Bitmap(_scope.bitmapWidth, _scope.bitmapHeight);
    if (_original) bmp.drawImage(_original, 0, 0, _scope.bitmapWidth, _scope.bitmapHeight, 0, 0, _scope.bitmapWidth, _scope.bitmapHeight);
    return bmp;
  }
  
  function beginPath() {
    getContext().beginPath();
    _drawLine = true;
  }

  function beginFill() {
    getContext().beginPath();
    _drawFill = true;
  }

  function addColorToGradient(gradient, stop, color, alpha) {
    var rgb = ASJS.Color.hexToRGB(color);
      rgb.a = alpha;
    gradient.addColorStop(stop, ASJS.Color.rgbToString(rgb));
  }

  function fillStyle(targetType, v) {
    var ctx = getContext();
    if (targetType == priv.TARGET_FILL) ctx.fillStyle = v;
    else ctx.strokeStyle = v;
  }

  function setLineStyle(size, miterLimit, lineJoin, lineCap) {
    var ctx = getContext();
      ctx.lineWidth = size;
      ctx.miterLimit = miterLimit || 10;
      ctx.lineJoin = lineJoin || ASJS.Bitmap.LINE_JOIN_MITER;
      ctx.lineCap = lineCap || ASJS.Bitmap.LINE_CAP_BUTT;
  }

  function beginColorFill(targetType, rgb, alpha) {
    var rgb = ASJS.Color.hexToRgb(rgb);
      rgb.a = alpha;
    fillStyle(targetType, ASJS.Color.rgbToString(rgb));
  }

  function beginGradientFill(targetType, type, gradientData, colors) {
    var ctx = getContext();
    var gradient;
    switch (type) {
      case ASJS.Bitmap.GRADIENT_LINEAR: gradient = ctx.createLinearGradient(gradientParams);
      break;
      case ASJS.Bitmap.GRADIENT_RADIAL: gradient = ctx.createRadialGradient(gradientParams);
      break;
    }
    var i = -1;
    var color;
    while (color = colors[ ++i ]) {
      addColorToGradient(gradient, color.stop, color.color, color.alpha);
    }
    fillStyle(targetType, gradient);
  }

  function beginPatternFill(targetType, image, repeat) {
    var pattern = getContext().createPattern(image.el, repeat || ASJS.Bitmap.PATTERN_REPEAT);
    fillStyle(targetType, pattern);
  }

  function getContext() {
    if (!_context) _context = _scope.el.getContext("2d");
    return _context;
  }

  function executeFilters() {
    if (!_filtersReady) return;
    _filtersReady = false;
    
    var l = _scope.bitmapFilters.length;

    if (l == 0) return;

    if (_scope.keepOriginal) {
      if (!_original) {
        _original = new ASJS.Image();
        _original.src = _scope.getDataUrl("image/png", 1.0);
      } else {
        _scope.drawImage(_original, 0, 0, _scope.bitmapWidth, _scope.bitmapHeight, 0, 0, _scope.bitmapWidth, _scope.bitmapHeight);
        _original = null;
      }
    }

    var i = -1;
    var pixels = _scope.getImageData(0, 0, _scope.bitmapWidth, _scope.bitmapHeight);
    var filter;
    while (filter = _scope.bitmapFilters[ ++i ]) {
      filter.execute(pixels);
    }
    _scope.putImageData(pixels, 0, 0);
    _filtersReady = true;
  }
});
cnst(ASJS.Bitmap, "GRADIENT_LINEAR",   "ASJS-Bitmap-gradientLinear");
cnst(ASJS.Bitmap, "GRADIENT_RADIAL",   "ASJS-Bitmap-gradientRadial");
cnst(ASJS.Bitmap, "PATTERN_REPEAT",    "repeat");
cnst(ASJS.Bitmap, "PATTERN_NO_REPEAT", "no-repeat");
cnst(ASJS.Bitmap, "PATTERN_REPEAT_X",  "repeat-x");
cnst(ASJS.Bitmap, "PATTERN_REPEAT_Y",  "repeat-y");
cnst(ASJS.Bitmap, "LINE_CAP_BUTT",     "butt");
cnst(ASJS.Bitmap, "LINE_CAP_ROUND",    "round");
cnst(ASJS.Bitmap, "LINE_CAP_SQUARE",   "square");
cnst(ASJS.Bitmap, "LINE_JOIN_BEVEL",   "bevel");
cnst(ASJS.Bitmap, "LINE_JOIN_ROUND",   "round");
cnst(ASJS.Bitmap, "LINE_JOIN_MITER",   "miter");
