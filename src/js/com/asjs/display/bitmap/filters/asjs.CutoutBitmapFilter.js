ASJS.import("com/asjs/display/bitmap/filters/asjs.AbstractBitmapFilter.js");

ASJS.CutoutBitmapFilter = createClass(
"CutoutBitmapFilter",
ASJS.AbstractBitmapFilter,
function(_scope) {
  var _map = {};
  var _average = 1;
  
  _scope.new = function(adjustment) {
    _scope.adjustment = adjustment;
    _average = 255 / _scope.adjustment;
  }
  
  _scope.execute = function(pixels) {
    var d = pixels.data;
    var i = -4;
    var l = d.length;
    while ((i += 4) < l) {
      d[i]     = convert(d[i]);
      d[i + 1] = convert(d[i + 1]);
      d[i + 2] = convert(d[i + 2]);
      d[i + 3] = convert(d[i + 3]);
    }
    
    _map = {};
  
    return pixels;
  }
  
  function convert(value) {
    if (!_map[value]) _map[value] = Math.floor(value / _average) * _average;
    return _map[value];
  }
});
