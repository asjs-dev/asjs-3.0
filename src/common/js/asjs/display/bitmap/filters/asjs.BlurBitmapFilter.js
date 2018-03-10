require("./asjs.AbstractConvoluteBitmapFilter.js");

ASJS.BlurBitmapFilter = createClass(
"BlurBitmapFilter", 
ASJS.AbstractConvoluteBitmapFilter, 
function(_scope, _super) {
  _scope.new = function(opaque, value) {
    _super.new(opaque);
    _scope.value = value;
  }

  get(_super.protected, "matrix", function() {
    var value = 1 / Math.pow(_scope.value, 2);
    var matrix = [];
    var i = -1;
    while (++i < _scope.value) {
      var j = -1;
      while (++j < _scope.value) matrix.push(value);
    }
    return matrix;
  });
});
