require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.TintFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function TintFilter(intensity, r, g, b) {
    AGL.AbstractFilter.call(this, 2, 4, intensity);

    this.r = r;
    this.g = g;
    this.b = b;
  }
);
