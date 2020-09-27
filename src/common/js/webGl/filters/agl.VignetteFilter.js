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
  }, function(_scope) {
    helpers.property(_scope, "roundness", {
      get: function() { return this._values[1]; },
      set: function(v) { this._values[1] = v; }
    });

    helpers.property(_scope, "transition", {
      get: function() { return this._values[5]; },
      set: function(v) { this._values[5] = v; }
    });
  }
);
