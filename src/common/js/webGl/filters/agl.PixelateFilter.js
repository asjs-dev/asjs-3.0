require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.PixelateFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function PixelateFilter(intensity) {
    AGL.BaseFilter.call(this, 4, 0, intensity);
  }
);
