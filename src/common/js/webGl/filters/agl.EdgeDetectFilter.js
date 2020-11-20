require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.EdgeDetectFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function EdgeDetectFilter(intensity) {
    AGL.AbstractFilter.call(this, 1, 0, intensity);

    helpers.arraySet(this.kernels, [
      -1, -1, -1,
      -1,  8, -1,
      -1, -1, -1
    ], 0);
  }
);
