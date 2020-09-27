require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.EdgeDetectFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function EdgeDetectFilter(intensity) {
    AGL.AbstractFilter.call(this);

    this.type = AGL.AbstractFilter.CONVOLUTE_TYPE;
    this.intensity = intensity;

    helpers.arraySet(this._kernels, [
      -1, -1, -1,
      -1,  8, -1,
      -1, -1, -1
    ], 0);
  }
);
