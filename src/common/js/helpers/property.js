require("./NameSpace.js");

helpers.property = function(target, name, descriptor) {
  descriptor.enumerable   = true;
  descriptor.configurable = true;
  Object.defineProperty(target, name, descriptor);
};

helpers.get = function(target, name, value) {
  helpers.property(target, name, {get: value});
};

helpers.set = function(target, name, value) {
  helpers.property(target, name, {set: value});
};
