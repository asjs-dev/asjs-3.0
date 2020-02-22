require("../utils/asjs.Color.js");
require("./asjs.AbstractBitmapFilter.js");

createClass(ASJS, "ColorChangeBitmapFilter", ASJS.AbstractBitmapFilter, function(_scope) {
  var _palette;

  _scope.new = function(palette) {
    _palette = {};
    for (var key in palette) _palette[key.toLowerCase()] = ASJS.Color.rgbHexToColor(palette[key]);
  }

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var i = -4;
    var l = d.length;
    var oColor = new ASJS.Color();
    while ((i += 4) < l) {
      if (d[i + 3] === 0) continue;

      oColor.set(d[i], d[i + 1], d[i + 2]);

      var hexValue      = ASJS.Color.colorToRgbHex(oColor);
      var selectedColor = _palette[hexValue];

      selectedColor && d.set([selectedColor.r, selectedColor.g, selectedColor.b], i);
    }

    _palette = {};
    oColor.destruct();
    oColor = null;

    return pixels;
  }
});
