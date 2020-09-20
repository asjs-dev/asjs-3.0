require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.EdgeDetectFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function EdgeDetectFilter() {
    AGL.AbstractFilter.call(this);

    this.type = AGL.AbstractFilter.CONVOLUTE_TYPE;
    this._values.set([
      -1, -1, -1,
      -1,  8, -1,
      -1, -1, -1
    ], 0);
  }
);
