createClass(ASJS, "Point", ASJS.BaseClass, function(_scope) {
  _scope.new = function(x, y) {
    _scope.x = x || 0;
    _scope.y = y || 0;
  }
});
