ASJS.AbstractBitmapFilter = createClass(
"AbstractBitmapFilter",
ASJS.BaseClass,
function(_scope) {
  _scope.execute = function(pixels) {
    return pixels;
  }
});
