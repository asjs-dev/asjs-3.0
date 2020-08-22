require("./createPrototypeClass.js");
require("./destructObjectFlat.js");

var BasePrototypeClass = c4(
  Object,
  function BasePrototypeClass() {},
  function() {
    this.destruct = function() {
      destObjFlat(this);
    }
    this.toObject  = function() {
      return JSON.parse(JSON.stringify(this));
    }
  }
);
