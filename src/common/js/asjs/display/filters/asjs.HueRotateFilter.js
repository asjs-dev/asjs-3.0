require("./asjs.AbstractFilter.js");

createClass(ASJS, "HueRotateFilter", ASJS.AbstractFilter, function(_scope) {
  _scope.execute = function() {
    return "hue-rotate(" + _scope.value + "deg)";
  }
});
