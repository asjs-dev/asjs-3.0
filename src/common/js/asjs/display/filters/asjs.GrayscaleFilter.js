require("./asjs.AbstractFilter.js");

helpers.createClass(ASJS, "GrayscaleFilter", ASJS.AbstractFilter, function(_scope) {
  _scope.execute = function() {
    return "grayscale(" + _scope.value + "%)";
  }
});
