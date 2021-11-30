require("./NameSpace.js");
require("./deleteProperty.js");
require("./iterateOver.js");

helpers.destructObjectFlat = function(target) {
  helpers.iterateOver(target, function(key, item, next) {
    helpers.deleteProperty(target, key);
    next();
  });
  target = null;
};
