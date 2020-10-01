require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.InvertFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function InvertFilter() {
    AGL.AbstractFilter.call(this, 2, 3);
  }
);
