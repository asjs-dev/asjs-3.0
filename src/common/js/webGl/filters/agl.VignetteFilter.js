require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.VignetteFilter = createPrototypeClass(
  AGL.AbstractColorFilter,
  function VignetteFilter() {
    AGL.AbstractColorFilter.call(this, 6);
  }
);
