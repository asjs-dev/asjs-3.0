require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.GlowFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function GlowFilter(intensityX, intensityY, volume) {
    AGL.AbstractFilter.call(this, 3, 2, intensityX);

    this.intensityY = intensityY;
    this.volume     = volume;
  }, function(_scope) {
    helpers.property(_scope, "volume", {
      get: function() { return this.values[3]; },
      set: function(v) { this.values[3] = v; }
    });
  }
);
