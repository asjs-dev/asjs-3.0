ASJS.import("com/asjs/display/filters/asjs.AbstractFilter.js");

ASJS.SaturateFilter = createClass(
"SaturateFiler",
ASJS.AbstractFilter,
function(_scope) {
  _scope.execute = function() {
    return "saturate(" + _scope.value + "%)";
  }
});
