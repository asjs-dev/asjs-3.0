import helpers from "./NameSpace.js";
import "./typeIs.js";

helpers.deepFreeze = function(obj) {
  var propNames = Object.getOwnPropertyNames(obj);

  for (var name of propNames) {
    var value = obj[name];
    value && helpers.typeIs(value, "object") && helpers.deepFreeze(value);
  }

  return Object.freeze(obj);
}
