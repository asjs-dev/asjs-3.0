require("./NameSpace.js");
require("./createPrototypeClass.js");
require("./destructObjectFlat.js");

helpers.BasePrototypeClass = helpers.BasePrototypeClass || helpers.createPrototypeClass(
  Object,
  function BasePrototypeClass() {},
  function(_scope, _super) {
    _scope.destruct = function() {
      helpers.destructObjectFlat(this);
      helpers.destructObjectFlat(_super);
      this.destruct = null;
    }

    _scope.toObject  = function() {
      return JSON.parse(JSON.stringify(this));
    }
  }
);
