require("../../NameSpace.js");

AGL.AbstractProps = createPrototypeClass(
  ASJS.BasePrototypeClass,
  function AbstractProps() {
    this.id = -1;
    this._currentId = -1;
  },
  function() {
    this.isUpdated = function() {
      var isUpdated = this._currentId !== this.id;
      this._currentId = this.id;
      return isUpdated;
    }
  }
);
