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

    var right  = imageWidth - rectangle.x - rectangle.width;
    var bottom = imageHeight - rectangle.y - rectangle.height;

    _helperBitmap.setBitmapSize(rectangle.x, rectangle.y);
    _helperBitmap.drawImage(_helperImage, 0, 0, rectangle.x, rectangle.y);
    _blocks[0].src = _helperBitmap.getDataUrl();
    _blocks[0].move(0, 0);
    _blocks[0].setSize(rectangle.x, rectangle.y);

    _helperBitmap.setBitmapSize(rectangle.width, rectangle.y);
    _helperBitmap.drawImage(_helperImage, rectangle.x, 0, rectangle.width, rectangle.y);
    _blocks[1].src = _helperBitmap.getDataUrl();
    _blocks[1].move(rectangle.x, 0);
    _blocks[1].setSize("calc(100% - " + (rectangle.x + right) + "px)", rectangle.y);

    _helperBitmap.setBitmapSize(right, rectangle.y);
    _helperBitmap.drawImage(_helperImage, rectangle.x + rectangle.width, 0, right, rectangle.y);
    _blocks[2].src = _helperBitmap.getDataUrl();
    _blocks[2].setCSS("right", 0);
    _blocks[2].y = 0;
    _blocks[2].setSize(right, rectangle.y);

    _helperBitmap.setBitmapSize(rectangle.x, rectangle.height);
    _helperBitmap.drawImage(_helperImage, 0, rectangle.y, rectangle.x, rectangle.height);
    _blocks[3].src = _helperBitmap.getDataUrl();
    _blocks[3].move(0, rectangle.y);
    _blocks[3].setSize(rectangle.x, "calc(100% - " + (rectangle.y + bottom) + "px)");

    _helperBitmap.setBitmapSize(rectangle.width, rectangle.height);
    _helperBitmap.drawImage(_helperImage, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    _blocks[4].src = _helperBitmap.getDataUrl();
    _blocks[4].move(rectangle.x, rectangle.y);
    _blocks[4].setSize("calc(100% - " + (rectangle.x + right) + "px)", "calc(100% - " + (rectangle.y + bottom) + "px)");

    _helperBitmap.setBitmapSize(right, rectangle.height);
    _helperBitmap.drawImage(_helperImage, rectangle.x + rectangle.width, rectangle.y, right, rectangle.height);
    _blocks[5].src = _helperBitmap.getDataUrl();
    _blocks[5].setCSS("right", 0);
    _blocks[5].y = rectangle.y;
    _blocks[5].setSize(right, "calc(100% - " + (rectangle.y + bottom) + "px)");

    _helperBitmap.setBitmapSize(rectangle.x, bottom);
    _helperBitmap.drawImage(_helperImage, 0, rectangle.y + rectangle.height, rectangle.x, bottom);
    _blocks[6].src = _helperBitmap.getDataUrl();
    _blocks[6].x = 0;
    _blocks[6].setCSS("bottom", 0);
    _blocks[6].setSize(rectangle.x, bottom);

    _helperBitmap.setBitmapSize(rectangle.width, bottom);
    _helperBitmap.drawImage(_helperImage, rectangle.x, rectangle.y + rectangle.height, rectangle.width, bottom);
    _blocks[7].src = _helperBitmap.getDataUrl();
    _blocks[7].x = rectangle.x;
    _blocks[7].setCSS("bottom", 0);
    _blocks[7].setSize("calc(100% - " + (rectangle.x + right) + "px)", bottom);

    _helperBitmap.setBitmapSize(right, bottom);
    _helperBitmap.drawImage(_helperImage, rectangle.x + rectangle.width, rectangle.y + rectangle.height, right, bottom);
    _blocks[8].src = _helperBitmap.getDataUrl();
    _blocks[8].setCSS("right", 0);
    _blocks[8].setCSS("bottom", 0);
    _blocks[8].setSize(right, bottom);

    _helperBitmap.destroy();
  }

  _scope.destruct = function() {
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
