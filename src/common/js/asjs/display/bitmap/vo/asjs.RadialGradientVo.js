ASJS.RadialGradientVo = createClass(
"RadialGradientVo",
ASJS.BaseClass,
function(_scope) {
  _scope.new = function(x0, y0, r0, x1, y1, r1) {
    _scope.x0 = x0 || 0;
    _scope.y0 = y0 || 0;
    _scope.r0 = r0 || 0;
    _scope.x1 = x1 || 0;
    _scope.y1 = y1 || 0;
    _scope.r1 = r1 || 0;
  }
});
