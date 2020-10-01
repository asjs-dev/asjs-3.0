require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.RainbowFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function RainbowFilter() {
    AGL.AbstractFilter.call(this, 2, 7);
  }
);
