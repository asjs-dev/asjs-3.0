require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.SharpenFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function SharpenFilter(intensity) {
    AGL.BaseFilter.call(this, 1, 0, intensity);

    helpers.arraySet(this.kernels, [
      -1,  -1,  -1,
      -1,  16,  -1,
      -1,  -1,  -1
    ], 0);
  }
);
