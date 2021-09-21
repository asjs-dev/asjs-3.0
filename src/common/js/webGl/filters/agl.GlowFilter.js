require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.GlowFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function GlowFilter(intensityX, intensityY, volume) {
    AGL.BaseFilter.call(this, 4, 2, intensityX);

    this.intensityY = intensityY;
    this.volume     = volume;
  }, function(_scope) {
    helpers.property(_scope, "volume", {
      get: function() { return this.v[3]; },
      set: function(v) { this.v[3] = v; }
    });
  }
);
