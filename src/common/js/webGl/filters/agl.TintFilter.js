require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.TintFilter = helpers.createPrototypeClass(
  AGL.AbstractColorFilter,
  function TintFilter(intensity, r, g, b) {
    AGL.AbstractColorFilter.call(this, 4);

    this.intensity = intensity;
    this.r         = r;
    this.g         = g;
    this.b         = b;
  }
);
