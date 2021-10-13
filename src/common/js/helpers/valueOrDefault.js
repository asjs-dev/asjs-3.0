require("./NameSpace.js");
require("./isEmpty.js");

helpers.valueOrDefault = function(value, def) {
  return helpers.isEmpty(value) ? def : value;
}
