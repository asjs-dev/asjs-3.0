require("./asjs.AbstractBitmapFilter.js");

createClass(ASJS, "TintBitmapFilter", ASJS.AbstractBitmapFilter, function(_scope, _super) {
  var _color;
  var _blendModeFunction;

  _scope.new = function(color, blendModeFunction) {
    _scope.color = color;
    _scope.blendModeFunction = blendModeFunction || ASJS.TintBitmapFilter.ADD;
  }

  prop(_scope, "color", {
    get: function() { return _color; },
    set: function(v) { _color = v || ASJS.Color.create(); }
  });

  prop(_scope, "blendModeFunction", {
    get: function() { return _blendModeFunction; },
    set: function(v) { _blendModeFunction = v || ASJS.TintBitmapFilter.ADD; }
  });

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var i = d.length;

    var color = ASJS.Color.create();

    var checkBefore = _blendModeFunction.before;

    while ((i -= 4) > -1) {
      if (d[i + 3] === 0) continue;

      ASJS.Color.set(color, d[i], d[i + 1], d[i + 2]);

      if (checkBefore && !checkBefore(color)) continue;

      d.set([
        _scope.blendModeFunction(color.r, _color.r),
        _scope.blendModeFunction(color.g, _color.g),
        _scope.blendModeFunction(color.b, _color.b)
      ], i);
    }

    color = null;
    color = null;

    return pixels;
  }

  _scope.destruct = function() {
    _blendModeFunction =
    _color             = null;

    _super.destruct();
  }
});

rof(ASJS.TintBitmapFilter, "ADD", function(s, d) {
  return d;
});
rof(ASJS.TintBitmapFilter, "AVG", function(s, d) {
  return bw(0, 255, Math.round((s + d) >> 1));
});
rof(ASJS.TintBitmapFilter, "MULTIPLY", function(s, d) {
  return bw(0, 255, Math.round((s * d) / 255));
});
rof(ASJS.TintBitmapFilter, "REAL", function(s, d) {
  return bw(0, 255, Math.round(d + ((s - 127) << 1)));
});
rof(ASJS.TintBitmapFilter.REAL, "before", function(c) {
  return ASJS.Color.isGray(c) && !ASJS.Color.isWhite(c) && !ASJS.Color.isBlack(c);
});
