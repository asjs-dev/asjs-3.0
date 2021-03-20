require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.ColorLimitFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function ColorLimitFilter(intensity) {
    AGL.BaseFilter.call(this, 2, 5, intensity);
  }
);
