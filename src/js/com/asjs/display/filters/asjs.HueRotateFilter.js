ASJS.import("com/asjs/display/filters/asjs.AbstractFilter.js");

ASJS.HueRotateFilter = createClass(
"HueRotateFilter",
ASJS.AbstractFilter,
function(_scope) {
  _scope.execute = function() {
    return "hue-rotate(" + _scope.value + "deg)";
  }
});
