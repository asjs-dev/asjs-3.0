require("../asjs.Bitmap.js");
require("./asjs.AbstractBitmapFilter.js");

helpers.createClass(ASJS, "AbstractConvoluteBitmapFilter", ASJS.AbstractBitmapFilter, function(_scope, _super) {
  _scope.new = function(opaque) {
    _scope.opaque = opaque;
  }

  helpers.get(_super.protected, "matrix", function() { return [1]; });

  _scope.execute = function(pixels) {
    var d = pixels.data;
    return convolute(pixels);
  }

  function convolute(pixels) {
    var weights = _super.protected.matrix;
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side * 0.5);

    var src = pixels.data;
    var sw = pixels.width;
    var sh = pixels.height;

    var w = sw;
    var h = sh;

    var bitmapHelper = new ASJS.Bitmap(w, h);
    var output = bitmapHelper.getImageData(0, 0, w, h);
    bitmapHelper.destruct();
    var dst = output.data;

    var alphaFac = _scope.opaque ? 1 : 0;

    var y = h;
    while (y--) {
      var x = w;
      while (x--) {
        var sy = y;
        var sx = x;
        var dstOff = (y * w + x) * 4;

        var r = 0;
        var g = 0;
        var b = 0;
        var a = 0;

        var cy = side;
        while (cy--) {
          var cx = side;
          while (cx--) {
            var scy = sy + cy - halfSide;
            var scx = sx + cx - halfSide;
            if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
              var srcOff = (scy * sw + scx) * 4;
              var wt = weights[cy * side + cx];
              r += src[srcOff] * wt;
              g += src[srcOff + 1] * wt;
              b += src[srcOff + 2] * wt;
              a += src[srcOff + 3] * wt;
            }
          }
        }
        dst.set([r, g, b, a + alphaFac * (255 - a)], dstOff);
      }
    }
    return output;
  };
});
