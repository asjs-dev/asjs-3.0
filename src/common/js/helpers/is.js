import helpers from "./NameSpace.js";

helpers.is = function(target, type) {
  try {
    return target instanceof type;
  } catch (e) {
    return false;
  }
}
