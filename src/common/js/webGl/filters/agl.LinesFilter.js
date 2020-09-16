require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.LinesFilter = createPrototypeClass(
  AGL.AbstractColorFilter,
  function LinesFilter() {
    AGL.AbstractColorFilter.call(this, 8);
  }
);
