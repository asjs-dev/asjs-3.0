require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.VignetteFilter = helpers.createPrototypeClass(
  AGL.AbstractColorFilter,
  function VignetteFilter(intensity, roundness, transition, r, g, b) {
    AGL.AbstractColorFilter.call(this, 6);

    this.intensity  = intensity;
    this.roundness  = roundness;
    this.transition = transition;
    this.r          = r;
    this.g          = g;
    this.b          = b;
  }, function() {
    helpers.property(this, "roundness", {
      get: function() { return this._values[1]; },
      set: function(v) { this._values[1] = v; }
    });

    helpers.property(this, "transition", {
      get: function() { return this._values[5]; },
      set: function(v) { this._values[5] = v; }
    });
  }
);
