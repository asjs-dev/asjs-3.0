require("./empty.js");

var valueOrDefault = function(value, def) {
  return emp(value) ? def : value;
}
var vod = valueOrDefault;
