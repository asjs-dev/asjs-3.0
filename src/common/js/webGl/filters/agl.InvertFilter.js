require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.InvertFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function InvertFilter(intensity) {
    AGL.BaseFilter.call(this, 3, 3, intensity);
  }
);
