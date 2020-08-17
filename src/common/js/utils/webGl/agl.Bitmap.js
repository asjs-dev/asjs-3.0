require("./utils/agl.Matrix3.js");
require("./utils/agl.Utils.js");
require("./NameSpace.js");

createClass(AGL, "Bitmap", ASJS.DisplayObject, function(_scope, _super) {
  _scope.clearColor = new AGL.ColorProps();

  var _gl;

  ASJS.CanvasApi.initBaseCanvas(_scope, _super);

  override(_scope, _super, "new");
  _scope.new = function(bitmapWidth, bitmapHeight, attributes) {
    _super.new("canvas");

    var contextAttributes = {
      alpha              : (attributes && attributes.alpha) || false,
      antialias          : (attributes && attributes.antialias) || false,
      depth              : (attributes && attributes.depth) || false,
      stencil            : (attributes && attributes.stencil) || false,
      premultipliedAlpha : (attributes && attributes.premultipliedAlpha) || false,
      powerPreference    : (attributes && attributes.powerPreference) || 'high-performance'
    };

    _super.protected.contextAttributes = contextAttributes;
    _super.protected.contextType = "webgl2";

    _scope.setBitmapSize(bitmapWidth, bitmapHeight);

    _gl = _scope.getContext();

    _gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    _gl.enable(_gl.BLEND);
  };

  _scope.clearRect = function() {
    var clearColor = _scope.clearColor;
    clearColor.isUpdated() && _gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
    _gl.clear(_gl.COLOR_BUFFER_BIT);
  }

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _scope.clearColor =
    _gl               = null;

    _scope.destructBaseCanvasApi();
    _super.destruct();
  }

  _scope.update = function() {
    _gl && _gl.viewport(0, 0, _gl.drawingBufferWidth, _gl.drawingBufferHeight);
    _scope.dispatchEvent(AGL.Bitmap.RESIZE);
  };
});
msg(AGL.Bitmap, "RESIZE");
