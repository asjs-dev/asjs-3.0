require("display/filters/asjs.AbstractFilter.js");

ASJS.InvertFilter = createClass(
"InvertFilter",
ASJS.AbstractFilter,
function(_scope) {
  _scope.execute = function() {
    return "invert(" + _scope.value + "%)";
  }
});
