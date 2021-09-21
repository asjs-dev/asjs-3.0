require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.TintFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function TintFilter(intensity, r, g, b) {
    AGL.BaseFilter.call(this, 3, 4, intensity);

    this.r = r;
    this.g = g;
    this.b = b;
  }
);
