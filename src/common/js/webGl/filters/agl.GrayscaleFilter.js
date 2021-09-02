require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.GrayscaleFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function GrayscaleFilter(intensity) {
    AGL.BaseFilter.call(this, 2, 1, intensity);
  }
);
