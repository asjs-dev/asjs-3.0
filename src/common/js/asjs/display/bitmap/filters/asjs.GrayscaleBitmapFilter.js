require("display/bitmap/filters/asjs.AbstractBitmapFilter.js");
require("display/bitmap/utils/asjs.Color.js");

ASJS.GrayscaleBitmapFilter = createClass(
"GrayscaleBitmapFilter",
ASJS.AbstractBitmapFilter,
function(_scope) {
  var _map = {};
  
  _scope.execute = function(pixels) {
    var d = pixels.data;
    var i = -4;
    var l = d.length;
    while ((i += 4) < l) {
      var oColo = new ASJS.Color(d[i], d[i + 1], d[i + 2], d[i + 3]);
      var hexValue = oColo.hex;
      
      if (!_map[hexValue]) _map[hexValue] = 0.2126 * oColo.r + 0.7152 * oColo.g + 0.0722 * oColo.b;
      
      d[i] = d[i + 1] = d[i + 2] = _map[hexValue];
    }
    
    _map = {};
  
    return pixels;
  }
});
