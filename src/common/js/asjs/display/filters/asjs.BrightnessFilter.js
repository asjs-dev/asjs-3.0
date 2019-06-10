require("./asjs.AbstractFilter.js");

createClass(ASJS, "BrightnessFilter", ASJS.AbstractFilter, function(_scope) {
  _scope.execute = function() {
    return "brightness(" + _scope.value + "%)";
  }
});
