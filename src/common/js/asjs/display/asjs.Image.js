require("./bitmap/asjs.Bitmap.js");
require("./asjs.DisplayObject.js");
require("../event/asjs.LoaderEvent.js");
require("../geom/asjs.Point.js");

createClass(ASJS, "Image", ASJS.DisplayObject, function(_scope, _super) {
  var _originalSize = new ASJS.Point();

  _scope.new = function() {
    _super.new("img");
  }

  get(_scope, "imageWidth", function() { return _originalSize.x; });
  get(_scope, "imageHeight", function() { return _originalSize.y; });

  prop(_scope, "src", {
    get: function() { return _scope.getAttr("src"); },
    set: function(v) {
      !_scope.hasEventListener(ASJS.LoaderEvent.LOAD, updateOriginalSize)
        && _scope.addEventListener(ASJS.LoaderEvent.LOAD, updateOriginalSize);
      _scope.setAttr("src", v);
    }
  });

  prop(_scope, "alt", {
    get: function() { return _scope.getAttr("alt"); },
    set: function(v) { _scope.setAttr("alt", v); }
  });

  function updateOriginalSize() {
    _originalSize = new ASJS.Point(
      _scope.el.naturalWidth || _scope.imageWidth,
      _scope.el.naturalHeight || _scope.imageHeight
    );
    _scope.dispatchEvent(ASJS.Image.UPDATED);
  }
});
rof(ASJS.Image, "convertToBitmap", function(image) {
  var bmp = new ASJS.Bitmap(image.imageWidth, image.imageHeight);
      bmp.setSize(image.imageWidth, image.imageHeight);
      bmp.drawImage(image, 0, 0, image.imageWidth, image.imageHeight, 0, 0, image.imageWidth, image.imageHeight);
  return bmp;
});
cnst(ASJS.Image, "UPDATED", "imageUpdated");
