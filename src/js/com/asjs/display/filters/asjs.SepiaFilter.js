ASJS.import("com/asjs/display/filters/asjs.AbstractFilter.js");

ASJS.SepiaFilter = createClass(
"SepiaFilter",
ASJS.AbstractFilter,
function(_scope) {
  _scope.execute = function() {
    return "sepia(" + _scope.value + "%)";
  }
});
