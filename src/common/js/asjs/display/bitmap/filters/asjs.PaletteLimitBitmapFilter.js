require("../utils/asjs.Color.js");
require("./asjs.AbstractBitmapFilter.js");

createClass(ASJS, "PaletteLimitBitmapFilter", ASJS.AbstractBitmapFilter, function(_scope) {
  var _map = {};
  var _palette;

  _scope.new = function(palette) {
    _palette = [];
    if (palette.length <= 0) return;

    var i = -1;
    var l = palette.length;
    while (++i < l) _palette.push(ASJS.Color.rgbHexToColor(palette[i]));
  }

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var selectedColor;
    var i = -4;
    var l = d.length;
    var m = _palette.length;
    var originalColor = new ASJS.Color();
    while ((i += 4) < l) {
      if (d[i + 3] === 0) continue;
      originalColor.set(d[i], d[i + 1], d[i + 2]);

      var hexValue = ASJS.Color.colorToRgbHex(originalColor);

      if (_map[hexValue]) selectedColor = _map[hexValue];
      else {
        var minDist = 768;
        selectedColor = _palette[0];

        var j = 0;
        while (++j < m) {
          var color = _palette[j];
          var dist = ASJS.Color.twoColorDistance(originalColor, color);
          if (dist < minDist) {
            minDist = dist;
            selectedColor = color;
          }
        }
      }
      _map[hexValue] = selectedColor;

      d[i]     = selectedColor.r;
      d[i + 1] = selectedColor.g;
      d[i + 2] = selectedColor.b;
    }

    _map = {};
    _palette = {};
    originalColor.destruct();
    originalColor = null;

    return pixels;
  }
});
