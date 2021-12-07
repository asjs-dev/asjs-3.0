import helpers from "./NameSpace.js";
import "./isEmpty.js";

helpers.map = function(object, callback) {
  for (var key in object) {
    if (!object.hasOwnProperty(key)) continue;
    var value = callback(key, object[key]);
    if (!helpers.isEmpty(value)) object[key] = value;
  }
}
