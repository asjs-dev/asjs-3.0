require("./NameSpace.js");
require("./iterateOver.js");
require("./deleteProperty.js");

helpers.destructObjectFlat = helpers.destructObjectFlat || function(target) {
  helpers.iterateOver(t, function(key, item, next) {
    helpers.deleteProperty(target, key);
    next();
  });
  target = null;
};
