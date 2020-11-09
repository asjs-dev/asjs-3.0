require("../NameSpace.js");

AGL.AbstractFilter = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function AbstractFilter(type, subType, intensity) {
    helpers.BasePrototypeClass.call(this);

    this.type    = type;
    this.subType = subType;
    this.on      = true;

    this._values  = new Float32Array(9);
    this._kernels = new Float32Array(9);

    this.intensity = intensity;
  },
  function(_scope, _super) {
    helpers.get(_scope, "values",  function() { return this._values; });
    helpers.get(_scope, "kernels", function() { return this._kernels; });

    helpers.property(_scope, "intensity", {
      get: function() { return this._values[0]; },
      set: function(v) { this._values[0] = v; }
    });

    helpers.property(_scope, "intensityX", {
      get: function() { return this._values[0]; },
      set: function(v) { this._values[0] = v; }
    });

    helpers.property(_scope, "intensityY", {
      get: function() { return this._values[1]; },
      set: function(v) { this._values[1] = v; }
    });

    helpers.property(_scope, "r", {
      get: function() { return this._values[2]; },
      set: function(v) { this._values[2] = v; }
    });

    helpers.property(_scope, "g", {
      get: function() { return this._values[3]; },
      set: function(v) { this._values[3] = v; }
    });

    helpers.property(_scope, "b", {
      get: function() { return this._values[4]; },
      set: function(v) { this._values[4] = v; }
    });
  }
);
