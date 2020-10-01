require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.ColorLimitFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function ColorLimitFilter(intensity) {
    AGL.AbstractFilter.call(this, 2, 5, intensity);
  }
);
