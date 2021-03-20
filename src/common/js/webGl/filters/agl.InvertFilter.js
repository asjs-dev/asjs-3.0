require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.InvertFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function InvertFilter() {
    AGL.BaseFilter.call(this, 2, 3);
  }
);
