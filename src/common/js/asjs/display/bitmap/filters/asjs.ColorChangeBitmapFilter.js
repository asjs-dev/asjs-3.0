require("../utils/asjs.Color.js");
require("./asjs.AbstractBitmapFilter.js");

ASJS.ColorChangeBitmapFilter = createClass(
"ColorChangeBitmapFilter",
ASJS.AbstractBitmapFilter,
function(_scope) {
  _scope.new = function(palette) {
    _scope.palette = {};
    for (var key in palette) {
      var color = ASJS.Color.hexToRgb(key);
      _scope.palette[color.hex] = ASJS.Color.hexToRgb(palette[key]);
    }
  }

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var i = -4;
    var l = d.length;
    var m = _scope.palette.length;
    while ((i += 4) < l) {
      var originalColor = new ASJS.Color(d[i], d[i + 1], d[i + 2], d[i + 3]);
      var hexValue = originalColor.hex;

      if (_scope.palette[hexValue]) {
        var selectedColor = _scope.palette[hexValue];

        d[i] = selectedColor.r;
        d[i + 1] = selectedColor.g;
        d[i + 2] = selectedColor.b;
        d[i + 3] = selectedColor.a;
      }
    }

    _scope.palette = {};

    return pixels;
  }
});
