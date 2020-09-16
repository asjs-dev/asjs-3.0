require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.GammaFilter = createPrototypeClass(
  AGL.AbstractColorFilter,
  function GammaFilter(intensity) {
    AGL.AbstractColorFilter.call(this, 10);

    this.intensity = intensity;
  }
);
