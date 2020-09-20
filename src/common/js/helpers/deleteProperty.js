require("./NameSpace.js");
require("./property.js");
require("./emptyFunction.js");

helpers.deleteProperty = helpers.deleteProperty || function(target, name) {
  var descriptor = Object.getOwnPropertyDescriptor(target, name);
  if (descriptor && (descriptor.get || descriptor.set)) helpers.property(target, name, {set: helpers.emptyFunction, get: helpers.emptyFunction});
  else {
    try {
      target[name] = null;
    } catch (e) {};
  }
  delete target[name];
}
