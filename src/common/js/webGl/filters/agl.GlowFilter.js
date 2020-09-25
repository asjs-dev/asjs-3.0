require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.GlowFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function GlowFilter(intensityX, intensityY, volume) {
    AGL.AbstractFilter.call(this);

    this.type       = 5;
    this.intensityX = intensityX;
    this.intensityY = intensityY;
    this.volume     = volume;
  }, function() {
    helpers.property(this, "volume", {
      get: function() { return this._values[3]; },
      set: function(v) { this._values[3] = v; }
    });
  }
);
