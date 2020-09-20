require("./NameSpace.js");
require("./isEmpty.js");

helpers.padStart = helpers.padStart || function(value, length) {
  return String(value / Math.pow(10, !helpers.isEmpty(l) ? length : 2)).substr(2);
}

helpers.between = helpers.between || function(min, max, value) {
  return Math.max(min, Math.min(max, value));
}

helpers.isBetween = helpers.isBetween || function(min, max, value) {
  return helpers.between(min, max, value) === value;
}
