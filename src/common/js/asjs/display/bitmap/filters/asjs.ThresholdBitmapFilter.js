require("display/bitmap/filters/asjs.AbstractBitmapFilter.js");
require("display/bitmap/utils/asjs.Color.js");

ASJS.ThresholdBitmapFilter = createClass(
"ThresholdBitmapFilter",
ASJS.AbstractBitmapFilter,
function(_scope) {
  var _map = {};
  
  _scope.new = function(threshold) {
    _scope.threshold = threshold;
  }
  
  _scope.execute = function(pixels) {
    var d = pixels.data;
    var i = -4;
    var l = d.length;
    while ((i += 4) < l) {
      var oColor = new ASJS.Color(d[i], d[i + 1], d[i + 2], d[i + 3]);
      var hexValue = oColor.hex;
      
      if (!_map[hexValue]) {
        _map[hexValue] = 0.2126 * oColor.r + 0.7152 * oColor.g + 0.0722 * oColor.b >= _scope.threshold 
            ? 255 
            : 0;
      }
      
      d[i] = d[i + 1] = d[i + 2] = _map[hexValue];
    }
    
    _map = {};
    
    return pixels;
  }
});
