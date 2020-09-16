require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.GlowFilter = createPrototypeClass(
  AGL.AbstractFilter,
  function GlowFilter(intensityX, intensityY) {
    AGL.AbstractFilter.call(this);

    this.type = 5;
    this.intensityX = intensityX;
    this.intensityY = intensityY;
  },
  function() {
    prop(this, "intensityX", {
      get: function() { return this._vals[0]; },
      set: function(v) { this._vals[0] = v; },
    });

    prop(this, "intensityY", {
      get: function() { return this._vals[1]; },
      set: function(v) { this._vals[1] = v; },
    });
  }
);
