require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.BlurFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function BlurFilter(intensityX, intensityY) {
    AGL.BaseFilter.call(this, 3, 1, intensityX);

    this.intensityY = intensityY;
  }
);
