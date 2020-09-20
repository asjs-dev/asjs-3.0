require("./NameSpace.js");
require("./isEmpty.js");

helpers.valueOrDefault = helpers.valueOrDefault || function(value, def) {
  return helpers.isEmpty(value) ? def : value;
}
