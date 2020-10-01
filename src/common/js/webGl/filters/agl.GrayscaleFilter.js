require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.GrayscaleFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function GrayscaleFilter() {
    AGL.AbstractFilter.call(this, 2, 1);
  }
);
