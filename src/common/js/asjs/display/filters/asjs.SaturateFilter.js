require("./asjs.AbstractFilter.js");

createClass(ASJS, "SaturateFiler", ASJS.AbstractFilter, function(_scope) {
  _scope.execute = function() {
    return "saturate(" + _scope.value + "%)";
  }
});
