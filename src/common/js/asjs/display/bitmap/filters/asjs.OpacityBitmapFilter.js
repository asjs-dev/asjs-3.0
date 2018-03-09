require("display/bitmap/filters/asjs.AbstractBitmapFilter.js");

ASJS.OpacityBitmapFilter = createClass(
"OpacityBitmapFilter",
ASJS.AbstractBitmapFilter,
function(_scope) {
  _scope.new = function(adjustment) {
    _scope.adjustment = adjustment;
  }

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var i = -4;
    var l = d.length;
    while ((i += 4) < l) d[i + 3] *= _scope.adjustment;
    return pixels;
  }
});
