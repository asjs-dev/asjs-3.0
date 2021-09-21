require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.SepiaFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function SepiaFilter(intensity) {
    AGL.BaseFilter.call(this, 3, 2, intensity);
  }
);
