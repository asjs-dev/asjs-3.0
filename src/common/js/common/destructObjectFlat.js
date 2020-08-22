require("./deleteProperty.js");

var destructObjectFlat = function(t, stack) {
  ito(t, function(key, item, next) {
    del(t, key);
    next();
  });
  t = null;
};
var destObjFlat = destructObjectFlat;
