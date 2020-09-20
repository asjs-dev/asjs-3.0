require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.SepiaFilter = helpers.createPrototypeClass(
  AGL.AbstractColorFilter,
  function SepiaFilter() {
    AGL.AbstractColorFilter.call(this, 2);
  }
);
