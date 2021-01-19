require("../NameSpace.js");

AGL.AbstractFilter = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function AbstractFilter(type, subType, intensity) {
    helpers.BasePrototypeClass.call(this);

    this.TYPE     = type;
    this.SUB_TYPE = subType;
    this.on       = true;

    this.v = new Float32Array(9);

    this.kernels = new Float32Array(9);

    this.intensity = intensity;
  },
  function(_scope, _super) {
    helpers.property(_scope, "intensity", {
      get: function() { return this.v[0]; },
      set: function(v) { this.v[0] = v; }
    });

    helpers.property(_scope, "intensityX", {
      get: function() { return this.v[0]; },
      set: function(v) { this.v[0] = v; }
    });

    helpers.property(_scope, "intensityY", {
      get: function() { return this.v[1]; },
      set: function(v) { this.v[1] = v; }
    });

    helpers.property(_scope, "r", {
      get: function() { return this.v[2]; },
      set: function(v) { this.v[2] = v; }
    });

    helpers.property(_scope, "g", {
      get: function() { return this.v[3]; },
      set: function(v) { this.v[3] = v; }
    });

    helpers.property(_scope, "b", {
      get: function() { return this.v[4]; },
      set: function(v) { this.v[4] = v; }
    });
  }
);
