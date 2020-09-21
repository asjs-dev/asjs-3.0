require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.LinesFilter = helpers.createPrototypeClass(
  AGL.AbstractColorFilter,
  function LinesFilter(intensity) {
    AGL.AbstractColorFilter.call(this, 8);

    this.intensity = intensity;
  }
);
