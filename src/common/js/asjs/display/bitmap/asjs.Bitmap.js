require("../asjs.DisplayObject.js");
require("./asjs.CanvasApi.js");

helpers.createClass(ASJS, "Bitmap", ASJS.DisplayObject, function(_scope, _super) {
  ASJS.CanvasApi.initCanvas(_scope, _super);

  helpers.override(_scope, _super, "new");
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

  helpers.override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _scope.destructCanvasApi();
    _super.destruct();
  }
});
