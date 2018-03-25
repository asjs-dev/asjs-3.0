require("../utils/asjs.Color.js");
require("./asjs.AbstractBitmapFilter.js");

ASJS.PaletteLimitBitmapFilter = createClass(
"PaletteLimitBitmapFilter",
ASJS.AbstractBitmapFilter,
function(_scope) {
  var _map = {};

  _scope.new = function(palette) {
    _scope.palette = [];
    if (palette.length <= 0) return;

    var i = -1;
    var l = palette.length;
    while (++i < l) {
      _scope.palette.push(ASJS.Color.hexToRgb(palette[i]));
    }
  }

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var selectedColor;
    var i = -4;
    var l = d.length;
    var m = _scope.palette.length;
    while ((i += 4) < l) {
      var originalColor = new ASJS.Color(d[i], d[i + 1], d[i + 2], d[i + 3]);
      var hexValue = originalColor.hex;

      if (_map[hexValue]) selectedColor = _map[hexValue];
      else {
        var minDist = 768;
        selectedColor = _scope.palette[0];

        var j = 0;
        while (++j < m) {
          var color = _scope.palette[j];
          var dist = ASJS.Color.twoColorDistance(originalColor, color);
          if (dist < minDist) {
            minDist = dist;
            selectedColor = color;
          }
        }
      }
      _map[hexValue] = selectedColor;

      d[i] = selectedColor.r;
      d[i + 1] = selectedColor.g;
      d[i + 2] = selectedColor.b;
      d[i + 3] = selectedColor.a;
    }

    _map = {};
    _scope.palette = {};

    return pixels;
  }
});
