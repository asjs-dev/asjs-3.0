require("../event/asjs.LoaderEvent.js");
require("../geom/asjs.Rectangle.js");
require("./bitmap/asjs.Bitmap.js");
require("./asjs.Sprite.js");
require("./asjs.Image.js");

createClass(ASJS, "Scale9Grid", ASJS.Sprite, function(_scope, _super) {
  var _helperImage  = new ASJS.Image();
  var _helperBitmap = new ASJS.Bitmap();

  var _blocks    = [];

  _scope.new = function() {
    _super.new();

    _scope.setCSS("position", "absolute");

    var i = 9;
    while (i--) {
      _blocks[i] = new ASJS.Image();
      _blocks[i].setCSS("position", "absolute");
      _scope.addChild(_blocks[i]);
    }
    
    _super.protected.lock();
  }

  _scope.init = function(backgroundImage, rectangle) {
    _helperImage.addEventListener(ASJS.LoaderEvent.LOAD, function() {
      _helperImage.removeEventListeners();

      render(_helperImage.imageWidth, _helperImage.imageHeight, rectangle);
    });
    _helperImage.src = backgroundImage;
  }

  function render(imageWidth, imageHeight, rectangle) {
    _scope.setCSS("min-width",  imageWidth);
    _scope.setCSS("min-height", imageHeight);

    var horizontalSize = rectangle.x + rectangle.width;
    var verticalSize   = rectangle.y + rectangle.height;

    var right  = imageWidth - horizontalSize;
    var bottom = imageHeight - verticalSize;

    _blocks[0].x = _blocks[3].x = _blocks[6].x =
    _blocks[0].y = _blocks[1].y = _blocks[2].y = 0;

    _blocks[1].x = _blocks[4].x = _blocks[7].x =
    _blocks[0].width = _blocks[3].width = _blocks[6].width = rectangle.x;

    _blocks[3].y = _blocks[4].y = _blocks[5].y =
    _blocks[0].height = _blocks[1].height = _blocks[2].height = rectangle.y;

    _blocks[2].width = _blocks[5].width = _blocks[8].width = right;

    _blocks[6].height = _blocks[7].height = _blocks[8].height = bottom;

    _blocks[1].width = _blocks[4].width = _blocks[7].width = "calc(100% - " + (rectangle.x + right) + "px)";

    _blocks[3].height = _blocks[4].height = _blocks[5].height = "calc(100% - " + (rectangle.y + bottom) + "px)";

    _blocks[2].setCSS("right", 0);
    _blocks[5].setCSS("right", 0);
    _blocks[8].setCSS("right", 0);

    _blocks[6].setCSS("bottom", 0);
    _blocks[7].setCSS("bottom", 0);
    _blocks[8].setCSS("bottom", 0);

    _helperBitmap.setBitmapSize(rectangle.x, rectangle.y);
    _helperBitmap.drawImage(_helperImage, 0, 0, rectangle.x, rectangle.y);
    _blocks[0].src = _helperBitmap.getDataUrl();

    _helperBitmap.setBitmapSize(rectangle.width, rectangle.y);
    _helperBitmap.drawImage(_helperImage, rectangle.x, 0, rectangle.width, rectangle.y);
    _blocks[1].src = _helperBitmap.getDataUrl();

    _helperBitmap.setBitmapSize(right, rectangle.y);
    _helperBitmap.drawImage(_helperImage, horizontalSize, 0, right, rectangle.y);
    _blocks[2].src = _helperBitmap.getDataUrl();

    _helperBitmap.setBitmapSize(rectangle.x, rectangle.height);
    _helperBitmap.drawImage(_helperImage, 0, rectangle.y, rectangle.x, rectangle.height);
    _blocks[3].src = _helperBitmap.getDataUrl();

    _helperBitmap.setBitmapSize(rectangle.width, rectangle.height);
    _helperBitmap.drawImage(_helperImage, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    _blocks[4].src = _helperBitmap.getDataUrl();

    _helperBitmap.setBitmapSize(right, rectangle.height);
    _helperBitmap.drawImage(_helperImage, horizontalSize, rectangle.y, right, rectangle.height);
    _blocks[5].src = _helperBitmap.getDataUrl();

    _helperBitmap.setBitmapSize(rectangle.x, bottom);
    _helperBitmap.drawImage(_helperImage, 0, verticalSize, rectangle.x, bottom);
    _blocks[6].src = _helperBitmap.getDataUrl();

    _helperBitmap.setBitmapSize(rectangle.width, bottom);
    _helperBitmap.drawImage(_helperImage, rectangle.x, verticalSize, rectangle.width, bottom);
    _blocks[7].src = _helperBitmap.getDataUrl();

    _helperBitmap.setBitmapSize(right, bottom);
    _helperBitmap.drawImage(_helperImage, horizontalSize, verticalSize, right, bottom);
    _blocks[8].src = _helperBitmap.getDataUrl();

    _helperBitmap.destroy();
  }

  _scope.destruct = function() {
    _super.protected.unlock();

    _helperImage.destruct();
    _helperBitmap.destruct();

    var i = _blocks.length;
    while (i--) {
      _scope.removeChild(_blocks[i]);
      _blocks[i].destruct();
      _blocks[i] = null;
    }
    _blocks = null;

    _super.destruct();
  }
});
