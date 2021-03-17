require("./NameSpace.js");
require("./iterateOver.js");
require("./deleteProperty.js");
require("./typeIs.js");

helpers.destructObjectFlat = helpers.destructObjectFlat || function(target) {
  helpers.iterateOver(target, function(key, item, next) {
    helpers.deleteProperty(target, key);
    next();
  });
  target = null;
};
