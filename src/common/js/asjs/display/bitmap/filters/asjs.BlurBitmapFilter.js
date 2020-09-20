require("./asjs.AbstractConvoluteBitmapFilter.js");

helpers.createClass(ASJS, "BlurBitmapFilter", ASJS.AbstractConvoluteBitmapFilter, function(_scope, _super) {
  helpers.override(_scope, _super, "new");
  _scope.new = function(opaque, value) {
    _super.new(opaque);
    _scope.value = value;
  }

  helpers.get(_super.protected, "matrix", function() {
    var value = 1 / Math.pow(_scope.value, 2);
    var matrix = [];
    var i = _scope.value;
    while (i--) {
      var j = _scope.value;
      while (j--) matrix.push(value);
    }
    return matrix;
  });
});
