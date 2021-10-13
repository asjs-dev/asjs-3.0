require("./NameSpace.js");

helpers.throttleFunction = function(callback) {
  var timeout;
  return function() {
    clearTimeout(timeout);
    var args = arguments;
    timeout = setTimeout(callback.bind(this, args), 1);
  }
}
