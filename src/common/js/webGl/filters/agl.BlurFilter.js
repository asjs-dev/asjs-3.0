require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.BlurFilter = helpers.createPrototypeClass(
  AGL.AbstractSamplingFilter,
  function BlurFilter(intensityX, intensityY) {
    AGL.AbstractSamplingFilter.call(this, 1);

    this.intensityX = intensityX;
    this.intensityY = intensityY;
  }
);
