require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.EdgeDetectFilter = createPrototypeClass(
  AGL.AbstractFilter,
  function EdgeDetectFilter() {
    AGL.AbstractFilter.call(this);

    this.type = AGL.AbstractFilter.CONVOLUTE_TYPE;
    this._vals.set([
      -1, -1, -1,
      -1,  8, -1,
      -1, -1, -1
    ], 0);
  }
);
