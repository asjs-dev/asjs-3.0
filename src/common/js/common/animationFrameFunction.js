var animationFrameFunction = function(callback) {
  return function() {
    var args = arguments;
    requestAnimationFrame(function() {
      callback.apply(this, args);
    });
  }
}
var aff = animationFrameFunction;
