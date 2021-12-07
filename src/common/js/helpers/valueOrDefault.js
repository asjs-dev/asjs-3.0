import helpers from "./NameSpace.js";
import "./isEmpty.js";

helpers.valueOrDefault = function(value, def) {
  return helpers.isEmpty(value) ? def : value;
}
