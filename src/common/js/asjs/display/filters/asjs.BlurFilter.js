require("./asjs.AbstractFilter.js");

createClass(ASJS, "BlurFilter", ASJS.AbstractFilter, function(_scope) {
  _scope.execute = function() {
    return "blur(" + _scope.value + "px)";
  }
});
