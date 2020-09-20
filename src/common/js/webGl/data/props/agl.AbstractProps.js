require("../../NameSpace.js");

AGL.AbstractProps = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function AbstractProps() {
    helpers.BasePrototypeClass.call(this);

    this._id              =
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
