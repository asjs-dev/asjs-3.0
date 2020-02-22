require("./asjs.AbstractBitmapFilter.js");

createClass(ASJS, "TintBitmapFilter", ASJS.AbstractBitmapFilter, function(_scope, _super) {
  _scope.new = function(color, blendModeFunction) {
    _scope.color = color || new ASJS.Color();
    _scope.blendModeFunction = blendModeFunction || ASJS.TintBitmapFilter.ADD;
  }

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var i = -4;
    var l = d.length;

    var color = new ASJS.Color();
    var colorCache = {};

    var rId;
    var r;

    var gId;
    var g;

    var bId;
    var b;

    while ((i += 4) < l) {
      if (d[i + 3] === 0) continue;

      color.set(d[i], d[i + 1], d[i + 2]);

      if (!color.isGray) continue;

      rId = color.r + "_" + _scope.color.r;
      gId = color.g + "_" + _scope.color.g;
      bId = color.b + "_" + _scope.color.b;

      r = colorCache[rId];
      if (!r) colorCache[rId] = r = _scope.blendModeFunction(color.r, _scope.color.r);

      g = colorCache[gId];
      if (!g) colorCache[gId] = g = _scope.blendModeFunction(color.g, _scope.color.g);

      b = colorCache[bId];
      if (!b) colorCache[bId] = b = _scope.blendModeFunction(color.b, _scope.color.b);

      d.set([r, g, b], i);
    }

    color.destruct();
    color = null;
    colorCache = null;

    return pixels;
  }

  _scope.destruct = function() {
    _scope.blendModeFunction = null;
    _scope.color.destruct();
    _scope.color = null;
    _super.destruct();
  }

});

rof(ASJS.TintBitmapFilter, "ADD", function(s, d) {
  return d;
});
rof(ASJS.TintBitmapFilter, "AVG", function(s, d) {
  return bw(0, 255, Math.round((s + d) / 2));
});
rof(ASJS.TintBitmapFilter, "MULTIPLY", function(s, d) {
  return bw(0, 255, Math.round((s * d) / 255));
});
rof(ASJS.TintBitmapFilter, "REAL", function(s, d) {
  return bw(0, 255, Math.round(d + ((s - 127) * 2)));
});
rof(ASJS.TintBitmapFilter, "GRAYSCALE_REAL", function(s, d) {
  return ASJS.TintBitmapFilter.REAL(s, d);
});
