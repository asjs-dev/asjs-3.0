require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.LinesFilter = helpers.createPrototypeClass(
  AGL.AbstractColorFilter,
  function LinesFilter() {
    AGL.AbstractColorFilter.call(this, 8);
  }
);
