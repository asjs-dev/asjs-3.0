require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.SepiaFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function SepiaFilter() {
    AGL.BaseFilter.call(this, 2, 2);
  }
);
