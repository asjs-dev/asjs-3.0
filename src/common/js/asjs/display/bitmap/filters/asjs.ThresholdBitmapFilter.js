require("../utils/asjs.Color.js");
require("./asjs.AbstractBitmapFilter.js");

createClass(ASJS, "ThresholdBitmapFilter", ASJS.AbstractBitmapFilter, function(_scope) {
  var _map = {};

  _scope.new = function(threshold) {
    _scope.threshold = threshold;
  }

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var i = d.length;
    var oColor = new ASJS.Color();
    while ((i -= 4) > -1) {
      if (d[i + 3] === 0) continue;

      oColor.set(d[i], d[i + 1], d[i + 2]);

      var hexValue = ASJS.Color.colorToRgbHex(oColor);

      if (!_map[hexValue]) {
        _map[hexValue] = 0.2126 * oColor.r + 0.7152 * oColor.g + 0.0722 * oColor.b >= _scope.threshold
            ? 255
            : 0;
      }

      d[i] = d[i + 1] = d[i + 2] = _map[hexValue];
    }

    _map = {};
    oColor.destruct();
    oColor = null;

    return pixels;
  }
});
