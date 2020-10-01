require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.PixelateFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function PixelateFilter(intensity) {
    AGL.AbstractFilter.call(this, 4, 0, intensity);
  }
);
