require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.BlurFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function BlurFilter(intensityX, intensityY) {
    AGL.AbstractFilter.call(this, 3, 1, intensityX);

    this.intensityY = intensityY;
  }
);
