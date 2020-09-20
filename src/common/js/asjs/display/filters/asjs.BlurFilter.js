require("./asjs.AbstractFilter.js");

helpers.createClass(ASJS, "BlurFilter", ASJS.AbstractFilter, function(_scope) {
  _scope.execute = function() {
    return "blur(" + _scope.value + "px)";
  }
});
