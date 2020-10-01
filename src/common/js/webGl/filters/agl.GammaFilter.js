require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.GammaFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function GammaFilter(intensity) {
    AGL.AbstractFilter.call(this, 2, 9, intensity);
  }
);
