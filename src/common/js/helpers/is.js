require("./NameSpace.js");

helpers.is = helpers.is || function(target, type) {
  try {
    return target instanceof type;
  } catch (e) {
    return false;
  }
}
