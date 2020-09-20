require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.ColorLimitFilter = helpers.createPrototypeClass(
  AGL.AbstractColorFilter,
  function ColorLimitFilter(intensity) {
    AGL.AbstractColorFilter.call(this, 5);

    this.intensity = intensity;
  }
);
