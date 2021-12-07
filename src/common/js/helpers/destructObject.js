import helpers from "./NameSpace.js";
import "./deleteProperty.js";
import "./createClass.js";
import "./typeIs.js";
import "./iterateOver.js";

helpers.destructObject = function(target, stack) {
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
