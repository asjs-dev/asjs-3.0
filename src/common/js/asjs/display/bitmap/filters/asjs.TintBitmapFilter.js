require("./asjs.AbstractBitmapFilter.js");

createClass(ASJS, "TintBitmapFilter", ASJS.AbstractBitmapFilter, function(_scope, _super) {
  _scope.color;
  _scope.blendModeFunction;

  _scope.new = function(color, blendModeFunction) {
    _scope.color = color;
    _scope.blendModeFunction = blendModeFunction || ASJS.TintBitmapFilter.ADD;
  }

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var l = d.length;

    var color = ASJS.Color.create();

    var checkBefore = _scope.blendModeFunction.before;

    var vect = new Float32Array([_scope.color.r, _scope.color.g, _scope.color.b]);

    for (var i = 0; i < l; i += 4) {
      if (d[i + 3] === 0) continue;

      ASJS.Color.set(d[i], d[i + 1], d[i + 2], 1, color);

      if (checkBefore && !checkBefore(color)) continue;

      d.set([
        _scope.blendModeFunction(color.r, vect[0]),
        _scope.blendModeFunction(color.g, vect[1]),
        _scope.blendModeFunction(color.b, vect[2])
      ], i);
    }

    color = null;

    return pixels;
  }

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _scope.blendModeFunction =
    _scope.color             = null;

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
