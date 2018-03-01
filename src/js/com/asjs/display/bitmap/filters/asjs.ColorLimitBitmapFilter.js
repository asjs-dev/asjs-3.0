ASJS.import("com/asjs/display/bitmap/filters/asjs.AbstractBitmapFilter.js");

ASJS.ColorLimitBitmapFilter = createClass(
"ColorLimitBitmapFilter",
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
      d[i] = convert(d[i]);
      d[i + 1] = convert(d[i + 1]);
      d[i + 2] = convert(d[i + 2]);
      d[i + 3] = convert(d[i + 3]);
    }
    
    _map = {};
    
    return pixels;
  }
  
  function convert(value) {
    if (!_map[value]) _map[value] = Math.round(value / _scope.threshold) * _scope.threshold;
    return _map[value];
  }
});
