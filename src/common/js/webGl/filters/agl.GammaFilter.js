require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.GammaFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function GammaFilter(intensity) {
    AGL.BaseFilter.call(this, 3, 9, intensity);
  }
);
