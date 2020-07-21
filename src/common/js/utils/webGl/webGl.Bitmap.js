require("./utils/webGl.Matrix3.js");
require("./utils/webGl.Utils.js");
require("./NameSpace.js");

createClass(WebGl, "Bitmap", ASJS.DisplayObject, function(_scope, _super) {
  _scope.clearColor = ASJS.Color.toFloat(ASJS.Color.create());

  var _gl;

  ASJS.CanvasApi.initBaseCanvas(_scope, _super);

  override(_scope, _super, "new");
  _scope.new = function(bitmapWidth, bitmapHeight, contextAttributes) {
    _super.new("canvas");

    if (!contextAttributes) contextAttributes = {};
    contextAttributes.premultipliedAlpha = true;
    contextAttributes.preserveDrawingBuffer = true;
    contextAttributes.stencil = true;

    _super.protected.contextAttributes = contextAttributes;
    _super.protected.contextType = "webgl2";

    _scope.setBitmapSize(bitmapWidth, bitmapHeight);

    _gl = _scope.getContext();

    _gl.enable(_gl.BLEND);

    _gl.depthMask(true);
    _gl.enable(_gl.DEPTH_TEST);
    _gl.depthFunc(_gl.ALWAYS);

    _gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    _gl.enable(_gl.SCISSOR_TEST);

    _scope.updateScissor();
  };

  _scope.clearRect = function(x, y, w, h) {
    _scope.setDrawArea(x, y, w, h);
    var clearColor = _scope.clearColor;
    _gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
    _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT | _gl.STENCIL_BUFFER_BIT);
  }

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _scope.clearColor =
    _gl               = null;

    _scope.destructBaseCanvasApi();
    _super.destruct();
  }

  _scope.setDrawArea = function(x, y, w, h) {
    _gl.scissor(x, _scope.bitmapHeight - y - h, w, h);
    _gl.viewport(0, 0, _scope.bitmapWidth, _scope.bitmapHeight);
  }

  _scope.updateScissor = function() {
    _gl && _gl.scissor(0, 0, _scope.bitmapWidth, _scope.bitmapHeight);
    _scope.dispatchEvent(WebGl.Bitmap.RESIZE);
  };

  _scope.update = _scope.updateScissor;
});
msg(WebGl.Bitmap, "RESIZE");
