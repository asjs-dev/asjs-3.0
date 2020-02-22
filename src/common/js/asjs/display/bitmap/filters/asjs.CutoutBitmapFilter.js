require("./asjs.AbstractBitmapFilter.js");

createClass(ASJS, "CutoutBitmapFilter", ASJS.AbstractBitmapFilter, function(_scope) {
  var _map = {};
  var _average = 1;

  _scope.new = function(adjustment) {
    _scope.adjustment = adjustment;
    _average = 255 / _scope.adjustment;
  }

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var i = -4;
    var l = d.length;
    while ((i += 4) < l) {
      d[i + 3] > 0 && d.set([convert(d[i]), convert(d[i + 1]), convert(d[i + 2])], i);
    }

    _map = {};

    return pixels;
  }

  function convert(value) {
    if (!_map[value]) _map[value] = Math.floor(value / _average) * _average;
    return _map[value];
  }
});
