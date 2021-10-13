require("./NameSpace.js");
require("./isEmpty.js");

helpers.iterateOver = function(object, callback, endCallback) {
  if (helpers.isEmpty(object)) return end();
  var keys = Object.keys(object);
  var key;
  var i = -1;
  function end() {
    endCallback && endCallback();
  }
  function next() {
    i++;
    if (i === keys.length) {
      end();
      return;
    }
    key = keys[i];
    if (object.hasOwnProperty && !object.hasOwnProperty(key)) next();
    var item;
    try {
      item = object[key];
    } catch (e) {}
    var v = callback(key, item, next, end);
    if (!helpers.isEmpty(v)) object[key] = v;
  }
  next();
}
