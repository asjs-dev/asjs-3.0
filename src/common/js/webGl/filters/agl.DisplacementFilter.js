require("../NameSpace.js");
require("./agl.BaseFilter.js");
require("../data/props/agl.FilterTextureProps.js");

AGL.DisplacementFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function DisplacementFilter(texture, intensity, translateX, translateY, cropX, cropY, cropWidth, cropHeight) {
    AGL.BaseFilter.call(this, 6, 0, intensity);

    this.textureProps = new AGL.FilterTextureProps(
      this,
      texture,
      translateX, translateY,
      cropX, cropY,
      cropWidth, cropHeight
    );
  }
);
