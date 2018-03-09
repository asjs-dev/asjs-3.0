require("display/bitmap/filters/asjs.AbstractBitmapFilter.js");

ASJS.BrightnessBitmapFilter = createClass(
"BrightnessBitmapFilter",
ASJS.AbstractBitmapFilter,
function(_scope) {
  _scope.new = function(adjustment) {
    _scope.adjustment = adjustment;
  }

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var i = -4;
    var l = d.length;
    while ((i += 4) < l) {
      d[i]     += _scope.adjustment;
      d[i + 1] += _scope.adjustment;
      d[i + 2] += _scope.adjustment;
    }
    return pixels;
  }
});
