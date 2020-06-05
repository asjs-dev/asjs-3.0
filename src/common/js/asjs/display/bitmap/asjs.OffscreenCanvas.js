require("./asjs.CanvasApi.js");

createClass(ASJS, "OffscreenCanvas", ASJS.BaseClass, function(_scope, _super) {
  ASJS.CanvasApi.initCanvas(_scope, _super);

  var _el;

  _scope.new = function(bitmapWidth, bitmapHeight, contextAttributes) {
    _el = new OffscreenCanvas(bitmapWidth || 1, bitmapHeight || 1);

    _super.protected.contextType = "2d";
    _super.protected.contextAttributes = contextAttributes;
  }

  get(_scope, "el", function() { return _el; });

  _scope.clone = function() {
    var pixels = _scope.getImageData(0, 0, _scope.bitmapWidth, _scope.bitmapHeight);

    var bmp = new ASJS.OffscreenCanvas(_scope.bitmapWidth, _scope.bitmapHeight, _scope.contextAttributes);
        bmp.putImageData(pixels, 0, 0);

    return bmp;
  }

  _scope.getOriginal = function() {
    if (!_scope.original) return _scope;

    var bmp = new ASJS.OffscreenCanvas(_scope.bitmapWidth, _scope.bitmapHeight, _scope.contextAttributes);
        bmp.putImageData(_scope.original, 0, 0);

    return bmp;
  }

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _scope.destructCanvasApi();
    _super.destruct();
  }
});
