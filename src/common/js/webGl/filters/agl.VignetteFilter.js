require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.VignetteFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function VignetteFilter(intensity, roundness, transition, r, g, b) {
    AGL.AbstractFilter.call(this, 2, 6, intensity);

    this.roundness  = roundness;
    this.transition = transition;
    this.r          = r;
    this.g          = g;
    this.b          = b;
  }, function(_scope) {
    helpers.property(_scope, "roundness", {
      get: function() { return this.values[1]; },
      set: function(v) { this.values[1] = v; }
    });

    helpers.property(_scope, "transition", {
      get: function() { return 1 / this.values[5]; },
      set: function(v) { this.values[5] = 1 / v; }
    });
  }
);
