require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.SharpenFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function SharpenFilter(intensity) {
    AGL.AbstractFilter.call(this, 1, 0, intensity);

    helpers.arraySet(this._kernels, [
      -1,  -1,  -1,
      -1,  16,  -1,
      -1,  -1,  -1
    ], 0);
  }
);
