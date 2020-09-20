require("./NameSpace.js");
require("./property.js");

helpers.constant = helpers.constant || function(target, name, value) {
  helpers.property(target, name, {value: value});
}
