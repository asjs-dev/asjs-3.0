require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.RainbowFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function RainbowFilter(intensity) {
    AGL.BaseFilter.call(this, 3, 7, intensity);
  }
);
