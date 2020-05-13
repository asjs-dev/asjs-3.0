require("../asjs.DisplayObject.js");
require("./asjs.CanvasApi.js");

createClass(ASJS, "Bitmap", ASJS.DisplayObject, function(_scope, _super) {
  ASJS.CanvasApi.initCanvas(_scope, _super);

  _scope.new = function(bitmapWidth, bitmapHeight, contextAttributes) {
    _super.new("canvas");

    _super.protected.contextType = "2d";
    _super.protected.contextAttributes = contextAttributes;

    _scope.setBitmapSize(bitmapWidth, bitmapHeight);
  }

  _scope.clone = function() {
    var pixels = _scope.getImageData(0, 0, _scope.bitmapWidth, _scope.bitmapHeight);

    var bmp = new ASJS.Bitmap(_scope.bitmapWidth, _scope.bitmapHeight, _scope.contextAttributes);
        bmp.putImageData(pixels, 0, 0);

    return bmp;
  }

  _scope.getOriginal = function() {
    if (!_scope.original) return _scope;

    var bmp = new ASJS.Bitmap(_scope.bitmapWidth, _scope.bitmapHeight, _scope.contextAttributes);
        bmp.putImageData(_scope.original, 0, 0);

    return bmp;
  }

  _scope.destruct = function() {
    _scope.destructCanvasApi();
    _super.destruct();
  }
});
