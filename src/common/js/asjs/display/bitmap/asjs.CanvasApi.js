require("../../geom/asjs.GeomUtils.js");
require("../bitmap/utils/asjs.Color.js");
require("../asjs.DisplayObject.js");
require("../asjs.Image.js");

createUtility(ASJS, "CanvasApi");
rof(ASJS.CanvasApi, "initBaseCanvas", function(_scope, _super) {
  var _context;
  var _contextAttributes;
  var _contextType;

  get(_scope, "contextAttributes", function() { return _contextAttributes; });
  set(_super.protected, "contextAttributes", function(v) { _contextAttributes = v; });

  get(_scope, "contextType", function() { return _contextType; });
  set(_super.protected, "contextType", function(v) { _contextType = v; });

  prop(_scope, "bitmapWidth", {
    get: function() { return _scope.el.width; },
    set: function(v) {
      _scope.el.width = Math.max(1, v || 1);
      _scope.update();
    }
  });

  prop(_scope, "bitmapHeight", {
    get: function() { return _scope.el.height; },
    set: function(v) {
      _scope.el.height = Math.max(1, v || 1);
      _scope.update();
    }
  });

  _scope.getContext = function() {
    if (!_context || (_context.isContextLost && _context.isContextLost())) {
      _context = _scope.el.getContext(_contextType, _contextAttributes);
    }
    return _context;
  }

  _scope.setBitmapSize = function(width, height) {
    if (height === undefined) height = width;
    _scope.bitmapWidth  = width;
    _scope.bitmapHeight = height;
  }

  _scope.destroyBaseCanvas = function() {
    _scope.setBitmapSize(1);
  }

  _scope.destructBaseCanvasApi = function() {
    _scope.destroyBaseCanvas();

    _context           =
    _contextAttributes =
    _contextType       = null;
  }

  _scope.update = function() {}
});
rof(ASJS.CanvasApi, "initCanvas", function(_scope, _super) {
  ASJS.CanvasApi.initBaseCanvas(_scope, _super);

  var _filtersReady = true;
  var _drawLine     = false;
  var _drawFill     = false;
  var _keepOriginal = false;
  var _bitmapFilters;
  var _original;

  get(_scope, "original", function() { return _original; });

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

  prop(_scope, "blendMode", {
    get: function() { return _scope.getContext().globalCompositeOperation; },
    set: function(v) { _scope.getContext().globalCompositeOperation = v; }
  });

  prop(_scope, "globalAlpha", {
    get: function() { return _scope.getContext().globalAlpha; },
    set: function(v) { _scope.getContext().globalAlpha = v; }
  });

  _scope.beginLineColorStyle = function(size, color, miterLimit, lineJoin, lineCap) {
    beginPath();
    setLineStyle(size, miterLimit, lineJoin, lineCap);
    beginColorFill(ASJS.CanvasApi.TARGET_STROKE, color);
  }

  _scope.beginLineGradientStyle = function(size, type, gradientParams, colors, lineMitter, lineJoin, lineCap) {
    beginPath();
    setLineStyle(size, miterLimit, lineJoin, lineCap);
    beginGradientFill(ASJS.CanvasApi.TARGET_STROKE, type, gradientParams, colors);
  }

  _scope.beginLinePatternStyle = function(size, image, repeat, lineMitter, lineJoin, lineCap) {
    beginPath();
    setLineStyle(size, miterLimit, lineJoin, lineCap);
    beginPatternFill(ASJS.CanvasApi.TARGET_STROKE, image, repeat);
  }

  _scope.beginColorFill = function(color) {
    beginFill();
    beginColorFill(ASJS.CanvasApi.TARGET_FILL, color);
  }

  _scope.beginGradientFill = function(type, gradientParams, colors) {
    beginFill();
    beginGradientFill(ASJS.CanvasApi.TARGET_FILL, type, gradientParams, colors);
  }

  _scope.beginPatternFill = function(image, repeat) {
    beginFill();
    beginPatternFill(ASJS.CanvasApi.TARGET_FILL, image, repeat);
  }

  _scope.translate = function(x, y) {
    _scope.getContext().translate(x, y);
  }

  _scope.rotate = function(v) {
    _scope.getContext().rotate(v * ASJS.GeomUtils.THETA);
  }

  _scope.scale = function(w, h) {
    _scope.getContext().scale(w, h);
  }

  _scope.transform = function(matrix) {
    _scope.getContext().transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
  }

  _scope.endLineStyle = function() {
    var ctx = _scope.getContext();
    _drawLine && ctx.stroke();
    _drawLine = false;
  }

  _scope.endFill = function() {
    var ctx = _scope.getContext();
        ctx.closePath();
    _drawFill && ctx.fill();
    _drawFill = false;
  }

  _scope.moveTo = function(x, y) {
    _scope.getContext().moveTo(x, y);
  }

  _scope.lineTo = function(x, y) {
    _scope.getContext().lineTo(x, y);
  }

  _scope.quadraticCurveTo = function(cp1x, cp1y, x, y) {
    _scope.getContext().quadraticCurveTo(cp1x, cp1y, x, y);
  }

  _scope.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
    _scope.getContext().bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  }

  _scope.beginPath = function() {
    _scope.getContext().beginPath();
  }

  _scope.closePath = function() {
    _scope.getContext().closePath();
  }

  _scope.fill = function() {
    _scope.getContext().fill();
  }

  _scope.rect = function(x, y, w, h) {
    _scope.getContext().rect(x, y, w, h);
  }

  _scope.drawRect = function(x, y, w, h) {
    var ctx = _scope.getContext();
    _drawFill && ctx.fillRect(x, y, w, h);
    _drawLine && ctx.strokeRect(x, y, w, h);
  }

  _scope.drawCircle = function(x, y, r) {
    if (y === undefined && r === undefined) y = r = x;
    _scope.drawArc(x, y, r, 0, 2 * Math.PI);
  }

  _scope.drawArc = function(x, y, r, begin, end, counterclockwise) {
    _scope.getContext().arc(x, y, r, begin, end, counterclockwise);
  }

  _scope.drawImage = function(image, sx, sy, sw, sh, x, y, w, h) {
    try {
      _scope.getContext().drawImage(
        image.el,
        sx || 0, sy || 0,
        sw || image.imageWidth, sh || image.imageHeight,
        x || 0, y || 0,
        w || _scope.bitmapWidth, h || _scope.bitmapHeight
      );
    } catch (e) {}
  }

  _scope.textStyle = function(font, align, baseline) {
    var ctx = _scope.getContext();
        ctx.font = font;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;
  }

  _scope.drawText = function(text, x, y) {
    var ctx = _scope.getContext();
    _drawFill && ctx.fillText(text, x, y);
    _drawLine && ctx.strokeText(text, x, y);
  }

  _scope.measureText = function(text) {
    return _scope.getContext().measureText(text);
  }

  _scope.clearRect = function(x, y, w, h) {
    _scope.getContext().clearRect(x, y, w, h);
  }

  _scope.getDataUrl = function(type, encoderOptions) {
    return _scope.el.toDataURL(type, encoderOptions);
  }

  _scope.getColorRgb = function(x, y) {
    var color = _scope.getImageData(x, y, 1, 1);
    return ASJS.Color.create(
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
    return _scope.getContext().getImageData(x, y, w, h);
  }

  _scope.putImageData = function(imageData, x, y) {
    _scope.getContext().putImageData(imageData, x, y);
  }

  _scope.merge = function(bitmap, srcX, srcY, srcW, srcH, x, y) {
    _scope.putImageData(bitmap.getImageData(srcX, srcY, srcW, srcH), x, y);
  }

  _scope.destroy = function() {
    _scope.destroyBaseCanvas();
    _original = null;
  }

  _scope.getCanvasClone = function() {
      var newCanvas = document.createElement('canvas');
      var context = newCanvas.getContext('2d');

      newCanvas.width = _scope.bitmapWidth;
      newCanvas.height = _scope.bitmapHeight;

      context.drawImage(_scope.el, 0, 0);

      return newCanvas;
  }

  _scope.save = function() {
    _scope.getContext().save();
  }

  _scope.restore = function() {
    _scope.getContext().restore();
  }

  _scope.destructCanvasApi = function() {
    _scope.destructBaseCanvasApi();

    _filtersReady  =
    _drawLine      =
    _keepOriginal  =
    _drawFill      =
    _bitmapFilters =
    _original      = null;
  }

  _scope.fillStyle = function(v) {
    _scope.getContext().fillStyle = v;
  }

  function beginPath() {
    _scope.getContext().beginPath();
    _drawLine = true;
  }

  function beginFill() {
    _scope.getContext().beginPath();
    _drawFill = true;
  }

  function addColorToGradient(gradient, stop, color) {
    gradient.addColorStop(stop, ASJS.Color.colorToString(ASJS.Color.parse(color)));
  }

  function fillStyle(targetType, v) {
    var ctx = _scope.getContext();
    if (targetType === ASJS.CanvasApi.TARGET_FILL) ctx.fillStyle = v;
    else ctx.strokeStyle = v;
  }

  function setLineStyle(size, miterLimit, lineJoin, lineCap) {
    var ctx = _scope.getContext();
        ctx.lineWidth = size;
        ctx.miterLimit = miterLimit || 10;
        ctx.lineJoin = lineJoin || ASJS.CanvasApi.LINE_JOIN_MITER;
        ctx.lineCap = lineCap || ASJS.CanvasApi.LINE_CAP_BUTT;
  }

  function beginColorFill(targetType, color) {
    fillStyle(targetType, ASJS.Color.colorToString(ASJS.Color.parse(color)));
  }

  function beginGradientFill(targetType, type, gradientData, colors) {
    var ctx = _scope.getContext();
    var gradient;
    switch (type) {
      case ASJS.CanvasApi.GRADIENT_LINEAR: gradient = ctx.createLinearGradient.apply(ctx, gradientData);
      break;
      case ASJS.CanvasApi.GRADIENT_RADIAL: gradient = ctx.createRadialGradient.apply(ctx, gradientData);
      break;
    }
    var i = -1;
    var color;
    while (color = colors[++i]) addColorToGradient(gradient, color.stop, color.color);
    fillStyle(targetType, gradient);
  }

  function beginPatternFill(targetType, image, repeat) {
    var pattern = _scope.getContext().createPattern(image.el, repeat || ASJS.CanvasApi.PATTERN_REPEAT);
    fillStyle(targetType, pattern);
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
      else _scope.putImageData(_original, 0, 0);
    }

    var pixels = _scope.getImageData(0, 0, _scope.bitmapWidth, _scope.bitmapHeight);
    var filter;
    var i = -1;
    while (filter = _scope.bitmapFilters[++i]) filter.execute(pixels);

    _scope.putImageData(pixels, 0, 0);
    _filtersReady = true;
  }
});
cnst(ASJS.CanvasApi, "TARGET_FILL",       "targetFill");
cnst(ASJS.CanvasApi, "TARGET_STROKE",     "targetStroke");
cnst(ASJS.CanvasApi, "GRADIENT_LINEAR",   "gradientLinear");
cnst(ASJS.CanvasApi, "GRADIENT_RADIAL",   "gradientRadial");
cnst(ASJS.CanvasApi, "PATTERN_REPEAT",    "repeat");
cnst(ASJS.CanvasApi, "PATTERN_NO_REPEAT", "no-repeat");
cnst(ASJS.CanvasApi, "PATTERN_REPEAT_X",  "repeat-x");
cnst(ASJS.CanvasApi, "PATTERN_REPEAT_Y",  "repeat-y");
cnst(ASJS.CanvasApi, "LINE_CAP_BUTT",     "butt");
cnst(ASJS.CanvasApi, "LINE_CAP_ROUND",    "round");
cnst(ASJS.CanvasApi, "LINE_CAP_SQUARE",   "square");
cnst(ASJS.CanvasApi, "LINE_JOIN_BEVEL",   "bevel");
cnst(ASJS.CanvasApi, "LINE_JOIN_ROUND",   "round");
cnst(ASJS.CanvasApi, "LINE_JOIN_MITER",   "miter");

/*
rof(ASJS.CanvasApi, "drawTriangle", function(ctx, im, x0, y0, x1, y1, x2, y2, sx0, sy0, sx1, sy1, sx2, sy2) {
  drawQuad(ctx, im, x0, y0, x1, y1, x2, y2, x2, y2, sx0, sy0, sx1, sy1, sx2, sy2);
});
rof(ASJS.CanvasApi, "drawQuad", function(ctx, im, x0, y0, x1, y1, x2, y2, x3, y3, sx0, sy0, sx1, sy1, sx2, sy2) {
  ctx.save();

  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.clip();

  var denom = (sx0 * (sy2 - sy1) - sx1 * sy2 + sx2 * sy1 + (sx1 - sx2) * sy0);
  if (denom === 0) return;

  var m11 = - (sy0 * (x2 - x1) - sy1 * x2 + sy2 * x1 + (sy1 - sy2) * x0) / denom;
  var m12 = (sy1 * y2 + sy0 * (y1 - y2) - sy2 * y1 + (sy2 - sy1) * y0) / denom;
  var m21 = (sx0 * (x2 - x1) - sx1 * x2 + sx2 * x1 + (sx1 - sx2) * x0) / denom;
  var m22 = - (sx1 * y2 + sx0 * (y1 - y2) - sx2 * y1 + (sx2 - sx1) * y0) / denom;
  var dx = (sx0 * (sy2 * x1 - sy1 * x2) + sy0 * (sx1 * x2 - sx2 * x1) + (sx2 * sy1 - sx1 * sy2) * x0) / denom;
  var dy = (sx0 * (sy2 * y1 - sy1 * y2) + sy0 * (sx1 * y2 - sx2 * y1) + (sx2 * sy1 - sx1 * sy2) * y0) / denom;

  ctx.transform(m11, m12, m21, m22, dx, dy);

  ctx.drawImage(im, 0, 0);
  ctx.restore();
});
*/
