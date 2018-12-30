ASJS.GradientColorVo = createClass(
"GradientColorVo",
ASJS.BaseClass,
function(_scope) {
  _scope.new = function(stop, color, alpha) {
    _scope.stop  = stop || 0;
    _scope.color = color || "#0";
    _scope.alpha = tis(alpha, "number") ? alpha : 1;
  }
});
