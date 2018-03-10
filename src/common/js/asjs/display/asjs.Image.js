require("./asjs.DisplayObject.js");
require("./bitmap/asjs.Bitmap.js");

ASJS.Image = createClass(
"Image",
ASJS.DisplayObject,
function(_scope, _super) {
  _scope.new = function() {
    _super.new("img");
  }

  get(_scope, "bitmap", function() {
    var bmp = new ASJS.Bitmap(_scope.imageWidth, _scope.imageHeight);
        bmp.drawImage(_scope, 0, 0, _scope.imageWidth, _scope.imageHeight, 0, 0, _scope.imageWidth, _scope.imageHeight);
    return bmp;
  });

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
