require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.SharpenFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function SharpenFilter(intensity) {
    AGL.AbstractFilter.call(this);

    this.type = AGL.AbstractFilter.CONVOLUTE_TYPE;
    this.intensity = intensity;

    this._kernels.set([
      -1,  -1,  -1,
      -1,  16,  -1,
      -1,  -1,  -1
    ], 0);
  }
);
