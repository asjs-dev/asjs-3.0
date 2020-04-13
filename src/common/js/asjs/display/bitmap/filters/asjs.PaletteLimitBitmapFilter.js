require("../utils/asjs.Color.js");
require("./asjs.AbstractBitmapFilter.js");

createClass(ASJS, "PaletteLimitBitmapFilter", ASJS.AbstractBitmapFilter, function(_scope) {
  var _map = {};
  var _palette;

  _scope.new = function(palette) {
    _palette = [];
    if (palette.length <= 0) return;

    var i = palette.length;
    while (i--) _palette.push(ASJS.Color.rgbHexToColor(palette[i]));
  }

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var selectedColor;
    var i = d.length;
    var m = _palette.length;
    var originalColor = ASJS.Color.create();
    while ((i -= 4) > -1) {
      if (d[i + 3] === 0) continue;
      ASJS.Color.set(originalColor, d[i], d[i + 1], d[i + 2]);

      var hexValue = ASJS.Color.colorToRgbHex(originalColor);

      if (_map[hexValue]) selectedColor = _map[hexValue];
      else {
        var minDist = 768;
        selectedColor = _palette[0];

        var j = m;
        while (j--) {
          var color = _palette[j];
          var dist = ASJS.Color.twoColorDistance(originalColor, color);
          if (dist < minDist) {
            minDist = dist;
            selectedColor = color;
          }
        }
      }
      _map[hexValue] = selectedColor;

      d.set([selectedColor.r, selectedColor.g, selectedColor.b], i);
    }

    _map = {};
    _palette = {};
    originalColor = null;
    originalColor = null;

    return pixels;
  }
});
