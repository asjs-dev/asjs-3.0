require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.GlowFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function GlowFilter(intensityX, intensityY) {
    AGL.AbstractFilter.call(this);

    this.type       = 5;
    this.intensityX = intensityX;
    this.intensityY = intensityY;
  },
  function() {
    helpers.property(this, "intensityX", {
      get: function() { return this._values[0]; },
      set: function(v) { this._values[0] = v; },
    });

    helpers.property(this, "intensityY", {
      get: function() { return this._values[1]; },
      set: function(v) { this._values[1] = v; },
    });
  }
);
