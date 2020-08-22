require("./map.js");

var dataMapper = function(data, objectType) {
  var instance = new objectType();
  map(data, function(key) {
    instance[key] = data[key];
  });

  return instance;
}
var dm = dataMapper;
