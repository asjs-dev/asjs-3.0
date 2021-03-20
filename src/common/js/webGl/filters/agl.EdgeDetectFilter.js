require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.EdgeDetectFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function EdgeDetectFilter(intensity) {
    AGL.BaseFilter.call(this, 1, 0, intensity);

    helpers.arraySet(this.kernels, [
      -1, -1, -1,
      -1,  8, -1,
      -1, -1, -1
    ], 0);
  }
);
