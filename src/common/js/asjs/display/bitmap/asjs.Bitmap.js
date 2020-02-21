require("../../geom/asjs.GeomUtils.js");
require("../bitmap/utils/asjs.Color.js");
require("../asjs.DisplayObject.js");
require("../asjs.Image.js");

createClass(ASJS, "Bitmap", ASJS.DisplayObject, function(_scope, _super) {
  var priv = {};

  cnst(priv, "TARGET_FILL",   "targetFill");
  cnst(priv, "TARGET_STROKE", "targetStroke");

  var _filtersReady = true;
  var _drawLine     = false;
  var _drawFill     = false;
  var _keepOriginal = false;
  var _context;
  var _bitmapFilters;
  var _original;

  _scope.new = function(bitmapWidth, bitmapHeight) {
    _super.new("canvas");
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
    _drawLine && ctx.stroke();
    _drawLine = false;
  }

  _scope.endFill = function() {
    var ctx = getContext();
    getContext().closePath();
    _drawFill && ctx.fill();
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
    _drawFill && ctx.fillRect(x, y, w, h);
    _drawLine && ctx.strokeRect(x, y, w, h);
  }

  _scope.drawCircle = function(x, y, r) {
    if (y === undefined && r === undefined) y = r = x;
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
      getContext().drawImage(
        image.el,
        sx || 0, sy || 0,
        sw || image.imageWidth, sh || image.imageHeight,
        x || 0, y || 0,
        w || _scope.bitmapWidth, h || _scope.bitmapHeight
      );
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
    _drawFill && ctx.fillText(text, x, y);
    _drawLine && ctx.strokeText(text, x, y);
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
    return new ASJS.Color(
      color.data[0],
      color.data[1],
      color.data[2],
      color.data[3] / 255
    );
  }

  _scope.setPixel = function(x, y) {
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
    _scope.setBitmapSize(1);
    _original = null;
  }

  _scope.setBitmapSize = function(width, height) {
    if (height === undefined) height = width;
    _scope.bitmapWidth = width;
    _scope.bitmapHeight = height;
  }

  _scope.clone = function() {
    var pixels = _scope.getImageData(0, 0, _scope.bitmapWidth, _scope.bitmapHeight);

    var bmp = new ASJS.Bitmap(_scope.bitmapWidth, _scope.bitmapHeight);
        bmp.putImageData(pixels, 0, 0);

    return bmp;
  }

  _scope.getCanvasClone = function() {
      var newCanvas = document.createElement('canvas');
      var context = newCanvas.getContext('2d');

      newCanvas.width = _scope.bitmapWidth;
      newCanvas.height = _scope.bitmapHeight;

      context.drawImage(_scope.el, 0, 0);

      return newCanvas;
  }

  _scope.getOriginal = function() {
    if (!_original) return _scope;

    var bmp = new ASJS.Bitmap(_scope.bitmapWidth, _scope.bitmapHeight);
        bmp.putImageData(_original, 0, 0);

    return bmp;
  }

  _scope.save = function() {
    getContext().save();
  }

  _scope.restore = function() {
    getContext().restore();
  }

  _scope.destruct = function() {
    _scope.destroy();

    priv           = null;
    _filtersReady  = null;
    _drawLine      = null;
    _keepOriginal  = null;
    _drawFill      = null;
    _context       = null;
    _bitmapFilters = null;
    _original      = null;

    _super.destruct();
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
    var rgba = is(color, ASJS.Color) ? color : ASJS.Color.rgbHexToColor(color);
        rgba.a = alpha;
    gradient.addColorStop(stop, ASJS.Color.colorToString(rgba));
  }

  function fillStyle(targetType, v) {
    var ctx = getContext();
    if (targetType === priv.TARGET_FILL) ctx.fillStyle = v;
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
    var rgba = is(rgb, ASJS.Color) ? rgb : ASJS.Color.rgbHexToColor(rgb);
        rgba.a = alpha;
    fillStyle(targetType, ASJS.Color.colorToString(rgba));
  }

  function beginGradientFill(targetType, type, gradientData, colors) {
    var ctx = getContext();
    var gradient;
    switch (type) {
      case ASJS.Bitmap.GRADIENT_LINEAR: gradient = ctx.createLinearGradient.apply(ctx, gradientData);
      break;
      case ASJS.Bitmap.GRADIENT_RADIAL: gradient = ctx.createRadialGradient.apply(ctx, gradientData);
      break;
    }
    var i = -1;
    var color;
    while (color = colors[++i]) addColorToGradient(gradient, color.stop, color.color, color.alpha);
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

  function clearBitmapFilters() {
    var filter;
    while (filter = _scope.bitmapFilters.shift()) filter.destruct();
  }

  function executeFilters() {
    if (!_filtersReady) return;
    _filtersReady = false;

    if (_scope.bitmapFilters.length === 0) return;

    if (_scope.keepOriginal) {
      if (!_original) _original = _scope.getImageData(0, 0, _scope.bitmapWidth, _scope.bitmapHeight);
      _scope.putImageData(_original, 0, 0);
    }

    var pixels = _scope.getImageData(0, 0, _scope.bitmapWidth, _scope.bitmapHeight);
    var filter;
    var i = -1;
    while (filter = _scope.bitmapFilters[++i]) filter.execute(pixels);

    _scope.putImageData(pixels, 0, 0);
    _filtersReady = true;
  }
});
cnst(ASJS.Bitmap, "GRADIENT_LINEAR",   "gradientLinear");
cnst(ASJS.Bitmap, "GRADIENT_RADIAL",   "gradientRadial");
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
