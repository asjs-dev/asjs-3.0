require("display/bitmap/filters/asjs.AbstractBitmapFilter.js");

ASJS.AlphaBitmapFilter = createClass(
"AlphaBitmapFilter",
ASJS.AbstractBitmapFilter,
function(_scope) {
  _scope.new = function(type) {
    _scope.type = type || ASJS.AlphaBitmapFilter.TYPE_DARKNESS;
  }

  _scope.execute = function(pixels) {
    var isDarkness = _scope.type === ASJS.AlphaBitmapFilter.TYPE_DARKNESS;
    var d = pixels.data;
    var i = -4;
    var l = d.length;
    while ((i += 4) < l) {
      var average = ((d[i] + d[i + 1] + d[i + 2]) / 3);
      d[i + 3] -= Math.round(isDarkness ? 255 - average : average);
    }
    return pixels;
  }
});
cnst(ASJS.AlphaBitmapFilter, "TYPE_DARKNESS",   "ASJS-AlphaBitmapFilter-typeDarkness");
cnst(ASJS.AlphaBitmapFilter, "TYPE_BRIGHTNESS", "ASJS-AlphaBitmapFilter-typeBrightness");
