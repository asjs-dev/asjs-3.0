require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.GlowFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function GlowFilter(intensityX, intensityY) {
    AGL.AbstractFilter.call(this);

    this.type       = 5;
    this.intensityX = intensityX;
    this.intensityY = intensityY;
  }
);
