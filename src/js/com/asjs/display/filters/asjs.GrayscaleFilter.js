ASJS.import("com/asjs/display/filters/asjs.AbstractFilter.js");

ASJS.GrayscaleFilter = createClass(
"GrayscaleFilter",
ASJS.AbstractFilter,
function(_scope) {
  _scope.execute = function() {
    return "grayscale(" + _scope.value + "%)";
  }
});
