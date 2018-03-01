ASJS.import("com/asjs/geom/asjs.Point.js");

ASJS.Rectangle = createClass(
"Rectangle",
ASJS.Point,
function(_scope, _super) {
  _scope.new = function(x, y, w, h) {
    _super.new(x, y);
    _scope.width  = w || 0;
    _scope.height = h || 0;
  }
});
