import helpers from "./NameSpace.js";
import "./property.js";

helpers.extendProperties = function(target) {
  var sup = {};
  for (var key in target) {
    if (["$n", "constructor"].indexOf(key) === -1) {
      var description = Object.getOwnPropertyDescriptor(target, key);
      if (!description) continue;
      if (description.writable) {
        if (
          ["prot", "protected"].indexOf(key) > -1 ||
          ["number", "string", "boolean", "object"].indexOf(typeof(description.value)) === -1
        ) sup[key] = target[key];
      } else helpers.property(sup, key, description);
    }
  }
  return sup;
};
