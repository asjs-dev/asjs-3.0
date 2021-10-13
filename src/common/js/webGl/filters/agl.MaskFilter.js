require("../NameSpace.js");
require("./agl.BaseFilter.js");
require("../data/props/agl.FilterTextureProps.js");

AGL.MaskFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function MaskFilter(texture, type, translateX, translateY, cropX, cropY, cropWidth, cropHeight) {
    AGL.BaseFilter.call(this, 7, 0, type);

    this.textureProps = new AGL.FilterTextureProps(
      this,
      texture,
      translateX, translateY,
      cropX, cropY,
      cropWidth, cropHeight
    );
  }, function(_scope) {
    helpers.property(_scope, "type", {
      get: function() { return this.v[0]; },
      set: function(v) { this.v[0] = v; }
    });
  }
);

AGL.MaskFilter.Type = {
  RED   : 0,
  GREEN : 1,
  BLUE  : 2,
  ALPHA : 3,
  AVG   : 4
};
