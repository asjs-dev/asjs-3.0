import helpers from "./NameSpace.js";
import "./deleteProperty.js";
import "./iterateOver.js";

helpers.destructObjectFlat = function(target) {
  helpers.iterateOver(target, function(key, item, next) {
    helpers.deleteProperty(target, key);
    next();
  });
  target = null;
};
