require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.VignetteFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function VignetteFilter(intensity, roundness, transition, r, g, b) {
    AGL.BaseFilter.call(this, 2, 6, intensity);

    this.roundness  = roundness;
    this.transition = transition;
    this.r          = r;
    this.g          = g;
    this.b          = b;
  }, function(_scope) {
    helpers.property(_scope, "roundness", {
      get: function() { return this.v[1]; },
      set: function(v) { this.v[1] = v; }
    });

    helpers.property(_scope, "transition", {
      get: function() { return 1 / this.v[5]; },
      set: function(v) { this.v[5] = 1 / v; }
    });
  }
);
