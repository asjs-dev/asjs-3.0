createClass(ASJS, "Point", ASJS.BaseClass, function(_scope) {
  _scope.new = function(x, y) {
    _scope.x = tis(x, "number") ? x : 0;
    _scope.y = tis(y, "number") ? y : 0;
  }
});
