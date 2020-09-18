require("../../NameSpace.js");

AGL.AbstractProps = createPrototypeClass(
  BasePrototypeClass,
  function AbstractProps() {
    BasePrototypeClass.call(this);
    this._id = -1;
    this._currentUpdateId = -1;
  },
  function() {
    this.isUpdated = function() {
      var isUpdated = this._currentUpdateId < this._id;
      this._currentUpdateId = this._id;
      return isUpdated;
    }
  }
);
