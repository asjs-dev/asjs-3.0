require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.RainbowFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function RainbowFilter() {
    AGL.BaseFilter.call(this, 2, 7);
  }
);
