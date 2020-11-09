require("./deleteProperty.js");
require("./createClass.js");
require("./iterateOver.js");
require("./typeIs.js");

helpers.destructObject = helpers.destructObject || function(target, stack) {
  var stack = stack || [];
  helpers.iterateOver(target, function(key, item, next) {
    var isItemObject = item && helpers.typeIs(item, "object") && !item.length;
    if (!isItemObject || stack.indexOf(item) < 0) {
      stack.push(item);
      isItemObject && helpers.destructObject(item, stack);
      helpers.destructClass(item);
      helpers.deleteProperty(target, key);
    }
    next();
  });
  stack  =
  target = null;
};
