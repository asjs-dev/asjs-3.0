require("./NameSpace.js");

helpers.nthCall = function(callback, nth) {
  var count = nth - 1;

  return function() {
    (count = (1 + count) % nth) === 0 && callback();
  };
}
