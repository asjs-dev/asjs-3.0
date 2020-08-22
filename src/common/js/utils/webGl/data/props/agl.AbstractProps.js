require("../../NameSpace.js");

AGL.AbstractProps = createPrototypeClass(
  BasePrototypeClass,
  function AbstractProps() {
    this.id = -1;
    this._curId = -1;
  },
  function() {
    this.isUpdated = function() {
      var isUpdated = this._curId !== this.id;
      this._curId = this.id;
      return isUpdated;
    }
  }
);
