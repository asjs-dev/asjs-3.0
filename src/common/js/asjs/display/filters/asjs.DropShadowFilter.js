require("./asjs.AbstractFilter.js");

createClass(ASJS, "DropShadowFilter", ASJS.AbstractFilter, function(_scope) {
  _scope.new = function(h, v, blur, spread, color) {
    _scope.h      = h || 0;
    _scope.v      = v || 0;
    _scope.blur   = blur || 0;
    _scope.spread = spread || 0;
    _scope.color  = color || "#000000";
  }

  _scope.execute = function() {
    return "drop-shadow(" + _scope.h + "px " + _scope.v + "px " + _scope.blur + "px " + _scope.spread + "px " + _scope.color + ")";
  }
});
