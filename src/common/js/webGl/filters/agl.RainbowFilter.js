require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.RainbowFilter = createPrototypeClass(
  AGL.AbstractColorFilter,
  function RainbowFilter() {
    AGL.AbstractColorFilter.call(this, 7);
  }
);
