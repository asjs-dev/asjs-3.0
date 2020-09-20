require("./asjs.AbstractBitmapFilter.js");

helpers.createClass(ASJS, "OpacityBitmapFilter", ASJS.AbstractBitmapFilter, function(_scope) {
  _scope.new = function(adjustment) {
    _scope.adjustment = adjustment;
  }

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var i = d.length;
    while ((i -= 4) > -1) d[i + 3] *= _scope.adjustment;
    return pixels;
  }
});
