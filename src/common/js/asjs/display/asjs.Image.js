require("./bitmap/asjs.Bitmap.js");
require("./asjs.DisplayObject.js");
require("../event/asjs.LoaderEvent.js");
require("../geom/asjs.Point.js");

helpers.createClass(ASJS, "Image", ASJS.DisplayObject, function(_scope, _super) {
  helpers.override(_scope, _super, "new");
  _scope.new = _super.new.bind(_scope, "img");

  helpers.get(_scope, "imageWidth", function() { return _scope.el.naturalWidth; });
  helpers.get(_scope, "imageHeight", function() { return _scope.el.naturalHeight; });

  ASJS.Tag.attrProp(_scope, "src");
  ASJS.Tag.attrProp(_scope, "alt");
});
helpers.constant(ASJS.Image, "convertToBitmap", function(image) {
  var bmp = new ASJS.Bitmap(image.imageWidth, image.imageHeight);
      bmp.setSize(image.imageWidth, image.imageHeight);
      bmp.drawImage(image, 0, 0, image.imageWidth, image.imageHeight, 0, 0, image.imageWidth, image.imageHeight);
  return bmp;
});
