require("./asjs.AbstractFilter.js");

helpers.createClass(ASJS, "SaturateFiler", ASJS.AbstractFilter, function(_scope) {
  _scope.execute = function() {
    return "saturate(" + _scope.value + "%)";
  }
});
