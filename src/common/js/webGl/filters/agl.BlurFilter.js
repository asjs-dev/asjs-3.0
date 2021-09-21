require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.BlurFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function BlurFilter(intensityX, intensityY) {
    AGL.BaseFilter.call(this, 4, 1, intensityX);

    this.intensityY = intensityY;
  }
);
