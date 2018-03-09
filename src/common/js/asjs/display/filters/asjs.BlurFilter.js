require("display/filters/asjs.AbstractFilter.js");

ASJS.BlurFilter = createClass(
"BlurFilter",
ASJS.AbstractFilter,
function(_scope) {
  _scope.execute = function() {
    return "blur(" + _scope.value + "px)";
  }
});
