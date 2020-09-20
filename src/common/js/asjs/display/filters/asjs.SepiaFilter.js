require("./asjs.AbstractFilter.js");

helpers.createClass(ASJS, "SepiaFilter", ASJS.AbstractFilter, function(_scope) {
  _scope.execute = function() {
    return "sepia(" + _scope.value + "%)";
  }
});
