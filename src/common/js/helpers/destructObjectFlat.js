require("./NameSpace.js");
require("./deleteProperty.js");

helpers.destructObjectFlat = function(target) {
  for (var key in target) helpers.deleteProperty(target, key);
  target = null;
};
