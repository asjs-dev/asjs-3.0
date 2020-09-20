require("./asjs.AbstractFilter.js");

helpers.createClass(ASJS, "DropShadowFilter", ASJS.AbstractFilter, function(_scope) {
  _scope.new = function(h, v, blur, spread, color) {
    _scope.h      = helpers.valueOrDefault(h, 0);
    _scope.v      = helpers.valueOrDefault(v, 0);
    _scope.blur   = helpers.valueOrDefault(blur, 0);
    _scope.spread = helpers.valueOrDefault(spread, 0);
    _scope.color  = helpers.valueOrDefault(color, ASJS.Color.create());
  }

  _scope.execute = function() {
    return "drop-shadow(" + _scope.h + "px " + _scope.v + "px " + _scope.blur + "px " + _scope.spread + "px " + ASJS.Color.colorToString(_scope.color) + ")";
  }
});
