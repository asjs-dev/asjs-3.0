require("./asjs.AbstractBitmapFilter.js");

createClass(ASJS, "InvertBitmapFilter", ASJS.AbstractBitmapFilter, function(_scope) {
  var _map = {};

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var i = -4;
    var l = d.length;
    while ((i += 4) < l) {
      if (d[i + 3] === 0) continue;
      d[i]     = convert(d[i]);
      d[i + 1] = convert(d[i + 1]);
      d[i + 2] = convert(d[i + 2]);
    }

    _map = {};

    return pixels;
  }

  function convert(value) {
    if (!_map[value]) _map[value] = 128 - (value - 128);
    return _map[value];
  }
});
