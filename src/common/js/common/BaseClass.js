require("./createClass.js");
require("./destructObject.js");
require("./emptyFunction.js");

c0(_w, "BaseClass", Object, function(_scope, _super) {
  _scope.new       = ef;
  _scope.protected = {};
  _scope.prot      = _scope.protected;
  _scope.destruct  = function() {
    destObj(_scope);
    destObj(_super);
    _scope =
    _super = null;
  }
  _scope.toObject  = function() {
    return JSON.parse(JSON.stringify(_scope));
  }
});
