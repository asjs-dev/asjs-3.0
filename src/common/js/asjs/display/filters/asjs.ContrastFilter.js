require("./asjs.AbstractFilter.js");

ASJS.ContrastFilter = createClass(
"ContrastFilter",
ASJS.AbstractFilter,
function(_scope) {
  _scope.execute = function() {
    return "contrast(" + _scope.value + "%)";
  }
});
