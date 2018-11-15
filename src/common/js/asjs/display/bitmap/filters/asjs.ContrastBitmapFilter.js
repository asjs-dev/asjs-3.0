require("./asjs.AbstractBitmapFilter.js");

ASJS.ContrastBitmapFilter = createClass(
"ContrastBitmapFilter",
ASJS.AbstractBitmapFilter,
function(_scope) {
  var _map = {};

  _scope.new = function(adjustment) {
    _scope.adjustment = adjustment;
  }

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
    if (!_map[value]) _map[value] = 128 - ((128 - value) * _scope.adjustment);
    return _map[value];
  }
});
