require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.SharpenFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function SharpenFilter() {
    AGL.AbstractFilter.call(this);

    this.type = AGL.AbstractFilter.CONVOLUTE_TYPE;
    this._values.set([
      -1,  -1,  -1,
      -1,  16,  -1,
      -1,  -1,  -1
    ], 0);
  }
);
