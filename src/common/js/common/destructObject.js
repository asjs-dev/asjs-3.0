require("./deleteProperty.js");
require("./createClass.js");
require("./iterateOver.js");

var destructObject = function(t, stack) {
  var stack = stack || [];
  ito(t, function(key, item, next) {
    var isItemObject = tis(item, "object");
    if (!isItemObject || stack.indexOf(item) === -1) {
      stack.push(item);
      isItemObject && destObj(item, stack);
      destCls(item);
      del(t, key);
    }
    next();
  });
  stack =
  t     = null;
};
var destObj = destructObject;
