require("./NameSpace.js");

helpers.isEmpty = function(target) {
  try {
    return target === undefined || target === null || target === "" || target.length === 0;
  } catch(e) {
    return true;
  }
}
