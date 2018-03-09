require("display/bitmap/filters/asjs.AbstractBitmapFilter.js");
require("geom/asjs.Point.js");

ASJS.MaskBitmapFilter = createClass(
"MaskBitmapFilter",
ASJS.AbstractBitmapFilter,
function(_scope) {
  _scope.new = function(mask, pos, invert, cutout) {
    _scope.mask   = mask;
    _scope.pos    = pos;
    _scope.invert = invert;
    _scope.cutout = empty(cutout) ? true : cutout;
  }
  
  _scope.execute = function(pixels) {
    var srcD = pixels.data;
    var maskPixels = _scope.mask.getImageData(0, 0, _scope.mask.bitmapWidth, _scope.mask.bitmapHeight);

    var maskD = maskPixels.data;

    var srcW = pixels.width;

    var maskW = maskPixels.width;
    var maskH = maskPixels.height;

    var maxMaskW = _scope.pos.x + maskW;
    var maxMaskH = _scope.pos.y + maskH;

    var i = -4;
    var l = srcD.length;
    while ((i += 4) < l) {
      var srcPixelLinearPos = Math.floor(i / 4);
      var srcPixelPos = new ASJS.Point(
        Math.floor(srcPixelLinearPos % srcW),
        Math.floor(srcPixelLinearPos / srcW)
      );
      if (srcPixelPos.x >= _scope.pos.x && srcPixelPos.y >= _scope.pos.y && srcPixelPos.x < maxMaskW && srcPixelPos.y < maxMaskH) {
        var j = ((srcPixelPos.y - _scope.pos.y) * maskW + (srcPixelPos.x - _scope.pos.x)) * 4;
        var sA = srcD[i + 3];
        var mA = maskD[j + 3];
    
        srcD[i + 3] = Math.floor(sA * ((_scope.invert ? (255 - mA) : mA) / 255));
      } else if (_scope.cutout) srcD[i + 3] = 0;
    }

    return pixels;
  }
});
