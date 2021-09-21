require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.ColorLimitFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function ColorLimitFilter(intensity) {
    AGL.BaseFilter.call(this, 3, 5, intensity);
  }
);
