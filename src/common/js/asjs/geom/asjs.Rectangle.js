require("./asjs.Point.js");

createClass(ASJS, "Rectangle", ASJS.Point, function(_scope, _super) {
  _scope.new = function(x, y, w, h) {
    _super.new(x, y);
    _scope.width  = tis(w, "number") ? w : 0;
    _scope.height = tis(h, "number") ? h : 0;
  }
});
