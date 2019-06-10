require("./asjs.AbstractBitmapFilter.js");

createClass(ASJS, "TintBitmapFilter", ASJS.AbstractBitmapFilter, function(_scope) {
  _scope.new = function(color, blendModeFunction) {
    _scope.color = color || new ASJS.Color();
    _scope.blendModeFunction = blendModeFunction || ASJS.TintBitmapFilter.ADD;
  }

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var i = -4;
    var l = d.length;

    var color = new ASJS.Color();

    while ((i += 4) < l) {
      if (d[i + 3] === 0) continue;

      color.set(d[i], d[i + 1], d[i + 2]);

      d[i]     = _scope.blendModeFunction(color.r, _scope.color.r, color);
      d[i + 1] = _scope.blendModeFunction(color.g, _scope.color.g, color);
      d[i + 2] = _scope.blendModeFunction(color.b, _scope.color.b, color);
    }

    return pixels;
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
  return bw(0, 255, Math.round(d + ((s - 127.5) * 2)));
});
rof(ASJS.TintBitmapFilter, "GRAYSCALE_REAL", function(s, d, color) {
  if (!color.isGray) return s;
  return ASJS.TintBitmapFilter.REAL(s, d);
});
