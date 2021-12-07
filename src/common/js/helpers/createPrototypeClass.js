import helpers from "./NameSpace.js";

helpers.createPrototypeClass = function(parent, construct, body) {
  var _super = parent.prototype;
  var _scope = construct.prototype;

  Object.setPrototypeOf(construct, parent);
  Object.setPrototypeOf(_scope, _super);

  body && body.call(_scope, _scope, _super);

  return construct;
}
