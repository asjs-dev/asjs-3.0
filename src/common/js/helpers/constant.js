import helpers from "./NameSpace.js";
import "./property.js";

helpers.constant = function(target, name, value) {
  helpers.property(target, name, {value: value});
}
