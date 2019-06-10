require("./asjs.AbstractFilter.js");

createClass(ASJS, "GrayscaleFilter", ASJS.AbstractFilter, function(_scope) {
  _scope.execute = function() {
    return "grayscale(" + _scope.value + "%)";
  }
});
