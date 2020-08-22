var createPrototypeClass = function(parent, construct, body) {
  var _super = parent.prototype;
  var _scope = construct.prototype;
  Object.setPrototypeOf(construct, parent);
  Object.setPrototypeOf(_scope, _super);
  _scope.constructor = construct;
  body && body.call(_scope, _super);
  return construct;
}
var c4 = createPrototypeClass;
