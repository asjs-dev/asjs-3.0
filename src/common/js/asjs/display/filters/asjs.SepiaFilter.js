require("./asjs.AbstractFilter.js");

createClass(ASJS, "SepiaFilter", ASJS.AbstractFilter, function(_scope) {
  _scope.execute = function() {
    return "sepia(" + _scope.value + "%)";
  }
});
