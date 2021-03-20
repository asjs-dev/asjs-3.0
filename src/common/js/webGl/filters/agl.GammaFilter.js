require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.GammaFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function GammaFilter(intensity) {
    AGL.BaseFilter.call(this, 2, 9, intensity);
  }
);
