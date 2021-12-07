import helpers from "./NameSpace.js";

helpers.animationFrameFunction = function(callback) {
  return function() {
    var args = arguments;
    requestAnimationFrame(function() {
      callback.apply(this, args);
    });
  }
}
