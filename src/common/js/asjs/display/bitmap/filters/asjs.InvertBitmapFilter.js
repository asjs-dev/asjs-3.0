require("./asjs.AbstractBitmapFilter.js");

helpers.createClass(ASJS, "InvertBitmapFilter", ASJS.AbstractBitmapFilter, function(_scope) {
  var _map = {};

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var i = d.length;
    while ((i -= 4) > -1) {
      d[i + 3] > 0 && d.set([convert(d[i]), convert(d[i + 1]), convert(d[i + 2])], i);
    }

    _map = {};

    return pixels;
  }

  function convert(value) {
    if (!_map[value]) _map[value] = 128 - (value - 128);
    return _map[value];
  }
});
