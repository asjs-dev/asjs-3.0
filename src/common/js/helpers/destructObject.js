require("./deleteProperty.js");
require("./createClass.js");
require("./typeIs.js");

helpers.destructObject = function(target, stack) {
  var stack = stack || [];
  for (var key in target) {
    var item = target[key];
    var isItemObject = item && helpers.typeIs(item, "object") && !item.length;
    if (!isItemObject || stack.indexOf(item) < 0) {
      stack.push(item);
      isItemObject && helpers.destructObject(item, stack);
      helpers.destructClass(item);
      helpers.deleteProperty(target, key);
    }
  };
  stack  =
  target = null;
};
