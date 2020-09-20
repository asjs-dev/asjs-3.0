require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.VignetteFilter = helpers.createPrototypeClass(
  AGL.AbstractColorFilter,
  function VignetteFilter() {
    AGL.AbstractColorFilter.call(this, 6);
  }
);
