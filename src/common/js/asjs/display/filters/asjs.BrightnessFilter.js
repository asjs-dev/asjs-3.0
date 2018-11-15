require("./asjs.AbstractFilter.js");

ASJS.BrightnessFilter = createClass(
"BrightnessFilter",
ASJS.AbstractFilter,
function(_scope) {
  _scope.execute = function() {
    return "brightness(" + _scope.value + "%)";
  }
});
