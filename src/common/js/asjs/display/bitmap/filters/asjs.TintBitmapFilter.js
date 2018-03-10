require("./asjs.AbstractBitmapFilter.js");

ASJS.TintBitmapFilter = createClass(
"TintBitmapFilter",
ASJS.AbstractBitmapFilter,
function(_scope) {
  _scope.new = function(r, g, b, a) {
    _scope.r = r || 0;
    _scope.g = g || 0;
    _scope.b = b || 0;
    _scope.a = a || 0;
  }

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var i = -4;
    var l = d.length;
    while ((i += 4) < l) {
      d[i]     += _scope.r;
      d[i + 1] += _scope.g;
      d[i + 2] += _scope.b;
      d[i + 3] += _scope.a;
    }
    return pixels;
  }
});
