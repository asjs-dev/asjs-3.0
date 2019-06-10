require("./bitmap/asjs.Bitmap.js");
require("./asjs.DisplayObject.js");

createClass(ASJS, "Image", ASJS.DisplayObject, function(_scope, _super) {
  _scope.new = function() {
    _super.new("img");
  }

  get(_scope, "imageWidth", function() { return _scope.el.width; });

  get(_scope, "imageHeight", function() { return _scope.el.height; });

  prop(_scope, "src", {
    get: function() { return _scope.getAttr("src"); },
    set: function(v) { _scope.setAttr("src", v); }
  });

  prop(_scope, "alt", {
    get: function() { return _scope.getAttr("alt"); },
    set: function(v) { _scope.setAttr("alt", v); }
  });
});
rof(ASJS.Image, "convertToBitmap", function(image) {
  var bmp = new ASJS.Bitmap(image.imageWidth, image.imageHeight);
      bmp.drawImage(image, 0, 0, image.imageWidth, image.imageHeight, 0, 0, image.imageWidth, image.imageHeight);
  return bmp;
});
