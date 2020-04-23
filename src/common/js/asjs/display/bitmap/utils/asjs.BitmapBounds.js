require("../../../geom/asjs.Rectangle.js");
require("../../../geom/asjs.Point.js");

createUtility(ASJS, "BitmapBounds");
rof(ASJS.BitmapBounds, "execute", function(bitmap) {
  var pixels = bitmap.getImageData(0, 0, bitmap.bitmapWidth, bitmap.bitmapHeight);

  var d = pixels.data;
  var w = pixels.width;
  var h = pixels.height;

  var size = ASJS.Rectangle.create(1/0, 1/0, -1/0, -1/0);

  var i = -4;
  var l = d.length;
  var pixelPos = ASJS.Point.create();
  while ((i += 4) < l) {
    if (d[ i + 3 ] > 0) {
      var pixelLinearPos = Math.floor(i / 4);

      pixelPos.x = Math.floor(pixelLinearPos % w);
      pixelPos.y = Math.floor(pixelLinearPos / w);

      size.x = Math.min(size.x, pixelPos.x);
      size.y = Math.min(size.y, pixelPos.y);

      size.width  = Math.max(size.width,  pixelPos.x - size.x + 1);
      size.height = Math.max(size.height, pixelPos.y - size.y + 1);
    }
  }

  pixelPos = null;

  return size;
});
