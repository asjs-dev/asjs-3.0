require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.RainbowFilter = helpers.createPrototypeClass(
  AGL.AbstractColorFilter,
  function RainbowFilter() {
    AGL.AbstractColorFilter.call(this, 7);
  }
);
