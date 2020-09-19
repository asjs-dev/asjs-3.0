var throttleFunction = function(callback) {
  var timeout;
  return function() {
    clearTimeout(timeout);
    var args = arguments;
    timeout = setTimeout(callback.bind(this, args), 1);
  }
}
var tfu = throttleFunction;
