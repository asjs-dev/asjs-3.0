require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.InvertFilter = helpers.createPrototypeClass(
  AGL.AbstractColorFilter,
  function InvertFilter() {
    AGL.AbstractColorFilter.call(this, 3);
  }
);
