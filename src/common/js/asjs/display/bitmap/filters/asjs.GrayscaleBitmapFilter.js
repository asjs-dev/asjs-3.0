require("../utils/asjs.Color.js");
require("./asjs.AbstractBitmapFilter.js");

createClass(ASJS, "GrayscaleBitmapFilter", ASJS.AbstractBitmapFilter, function(_scope) {
  var _map = {};

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var oColor = ASJS.Color.create();
    var i = d.length;
    while ((i -= 4) > -1) {
      if (d[i + 3] === 0) continue;

      ASJS.Color.set(oColor, d[i], d[i + 1], d[i + 2]);

      var hexValue = ASJS.Color.colorToRgbHex(oColor);

      if (!_map[hexValue]) _map[hexValue] = 0.2126 * oColor.r + 0.7152 * oColor.g + 0.0722 * oColor.b;

      d[i] = d[i + 1] = d[i + 2] = _map[hexValue];
    }

    _map = {};
    oColor = null;
    oColor = null;

    return pixels;
  }
});
