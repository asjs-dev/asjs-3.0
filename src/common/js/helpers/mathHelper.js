require("./NameSpace.js");
require("./isEmpty.js");

helpers.padStart = function(value, length) {
  return String(Math.pow(10, length || 1)).substr(1 + String(parseInt(value)).length) + String(value);
}

helpers.between = function(min, max, value) {
  return Math.max(min, Math.min(max, value));
}

helpers.isBetween = function(min, max, value) {
  return helpers.between(min, max, value) === value;
}
