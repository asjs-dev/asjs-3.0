require("./asjs.AbstractFilter.js");

createClass(ASJS, "InvertFilter", ASJS.AbstractFilter, function(_scope) {
  _scope.execute = function() {
    return "invert(" + _scope.value + "%)";
  }
});
