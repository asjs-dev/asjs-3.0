require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.PixelateFilter = createPrototypeClass(
  AGL.AbstractFilter,
  function PixelateFilter(intensity) {
    AGL.AbstractFilter.call(this);

    this.type = 4;
    this.intensity = intensity;
  }
);
