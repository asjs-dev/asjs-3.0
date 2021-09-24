require("./NameSpace.js");
require("./createClass.js");
require("./destructObject.js");
require("./emptyFunction.js");

helpers.createClass(helpers, "BaseClass", Object, function(_scope, _super) {
  _scope.new       = helpers.emptyFunction;
  _scope.protected = {};
  _scope.prot      = _scope.protected;
  _scope.destruct  = function() {
    helpers.destructObject(_scope);
    helpers.destructObject(_super);
    _scope =
    _super = null;
  }
});
