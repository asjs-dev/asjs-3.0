require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.AbstractSamplingFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function AbstractSamplingFilter(subType) {
    AGL.AbstractFilter.call(this);

    this.type    = 3;
    this.subType = subType;
  }
);
