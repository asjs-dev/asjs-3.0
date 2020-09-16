require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.AbstractColorFilter = createPrototypeClass(
  AGL.AbstractFilter,
  function AbstractColorFilter(subType) {
    AGL.AbstractFilter.call(this);

    this.type = 2;
    this.subType = subType;
  }
);