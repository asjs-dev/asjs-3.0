require("./NameSpace.js");
require("./createPrototypeClass.js");
require("./destructObjectFlat.js");

helpers.BasePrototypeClass = helpers.BasePrototypeClass || helpers.createPrototypeClass(
  Object,
  function BasePrototypeClass() {},
  function() {
    this.destruct = function() {
      helpers.destructObjectFlat(this);
    }
    this.toObject  = function() {
      return JSON.parse(JSON.stringify(this));
    }
  }
);
