require("./NameSpace.js");
require("./iterateOver.js");
require("./deleteProperty.js");
require("./typeIs.js");

helpers.destructObjectFlat = helpers.destructObjectFlat || function(target, stack) {
  var stack = stack || [];
  helpers.iterateOver(target, function(key, item, next) {
    var isItemObject = item && helpers.typeIs(item, "object") && !item.length;
    if (!isItemObject || stack.indexOf(item) < 0) {
      stack.push(item);
      isItemObject && helpers.destructObjectFlat(item, stack);
      helpers.deleteProperty(target, key);
    }
    next();
  });
  target =
  stack  = null;
};
