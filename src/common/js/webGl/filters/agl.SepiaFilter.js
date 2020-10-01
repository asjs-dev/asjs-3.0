require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.SepiaFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function SepiaFilter() {
    AGL.AbstractFilter.call(this, 2, 2);
  }
);
