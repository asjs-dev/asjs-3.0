require("./asjs.AbstractFilter.js");

helpers.createClass(ASJS, "ContrastFilter", ASJS.AbstractFilter, function(_scope) {
  _scope.execute = function() {
    return "contrast(" + _scope.value + "%)";
  }
});
