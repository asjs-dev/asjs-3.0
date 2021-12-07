import helpers from "./NameSpace.js";
import "./typeIs.js";

helpers.clone = function(a) {
  if (helpers.typeIs(a, "object")) return a;

  var b = Array.isArray(a)
    ? []
    : {};
  var propNames = Object.getOwnPropertyNames(a);
  var i = propNames.length;
  var key;
  while (i--) {
    key = propNames[i];
    b[key] = helpers.typeIs(a[key], "object")
      ? helpers.clone(a[key])
      : a[key];
  }
  return b;
};
