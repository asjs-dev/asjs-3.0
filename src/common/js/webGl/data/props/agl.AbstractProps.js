require("../../NameSpace.js");

AGL.AbstractProps = createPrototypeClass(
  BasePrototypeClass,
  function AbstractProps() {
    BasePrototypeClass.call(this);
    this._id = -1;
    this._curId = -1;
  },
  function() {
    this.isUpdated = function() {
      var isUpdated = this._curId < this._id;
      this._curId = this._id;
      return isUpdated;
    }
  }
);
