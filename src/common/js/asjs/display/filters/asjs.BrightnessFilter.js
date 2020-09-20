require("./asjs.AbstractFilter.js");

helpers.createClass(ASJS, "BrightnessFilter", ASJS.AbstractFilter, function(_scope) {
  _scope.execute = function() {
    return "brightness(" + _scope.value + "%)";
  }
});
