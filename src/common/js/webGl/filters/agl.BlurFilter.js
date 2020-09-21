require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.BlurFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function BlurFilter(intensityX, intensityY) {
    AGL.AbstractFilter.call(this);

    this.type       = 3;
    this.intensityX = intensityX;
    this.intensityY = intensityY;
  }
);
