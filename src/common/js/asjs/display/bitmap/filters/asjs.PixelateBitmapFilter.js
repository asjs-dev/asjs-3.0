require("../../../geom/asjs.Point.js");
require("./asjs.AbstractBitmapFilter.js");

ASJS.PixelateBitmapFilter = createClass(
"PixelateBitmapFilter",
ASJS.AbstractBitmapFilter,
function(_scope) {
  _scope.new = function(value) {
    _scope.value = value;
  }

  _scope.execute = function(pixels) {
    var d = pixels.data;
    var pixS = _scope.value;

    var w = pixels.width;
    var h = pixels.height;

    var step = 4 * pixS;
    var i = - step;
    var l = d.length;
    while ((i += step) < l) {
      var pixelLinearPos = Math.floor(i / 4);
      var pixelPos = new ASJS.Point(
        Math.floor(pixelLinearPos % w),
        Math.floor(pixelLinearPos / w)
      );

      if (pixelPos.x % pixS > 0) i = i - pixelPos.x * 4 - step;
      else if ((pixelPos.y % pixS) == 0) {
        var x;
        var y;
        var r = 0;
        var g = 0;
        var b = 0;
        var a = 0;
        var maxW = Math.min(w - pixelPos.x, pixS);
        var maxH = Math.min(h - pixelPos.y, pixS);
        x = -1;
        while (++x < maxW) {
          y = -1;
          while (++y < maxH) {
            var pos = i + y * 4 * w + x * 4;
            r += d[pos];
            g += d[pos + 1];
            b += d[pos + 2];
            a += d[pos + 3];
          }
        }

        var pb = maxW * maxH;
        r = Math.round(r / pb);
        g = Math.round(g / pb);
        b = Math.round(b / pb);
        a = Math.round(a / pb);

        x = -1;
        while (++x < maxW) {
          y = -1;
          while (++y < maxH) {
            var pos = i + y * 4 * w + x * 4;
            d[pos] = r;
            d[pos + 1] = g;
            d[pos + 2] = b;
            d[pos + 3] = a;
          }
        }
      }
    }

    return pixels;
  }
});
