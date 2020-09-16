require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.SepiaFilter = createPrototypeClass(
  AGL.AbstractColorFilter,
  function SepiaFilter() {
    AGL.AbstractColorFilter.call(this, 2);
  }
);
