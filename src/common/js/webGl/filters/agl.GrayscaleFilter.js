require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.GrayscaleFilter = helpers.createPrototypeClass(
  AGL.AbstractColorFilter,
  function GrayscaleFilter() {
    AGL.AbstractColorFilter.call(this, 1);
  }
);
