require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.DisplacementFilter = createPrototypeClass(
  AGL.AbstractFilter,
  function DisplacementFilter(texture, intensity, x, y) {
    AGL.AbstractFilter.call(this);

    this.type      = 6;
    this.texture   = texture;
    this.intensity = intensity;
    this.x         = x;
    this.y         = y;
  }, function() {
    prop(this, "x", {
      get: function() { return this._values[1]; },
      set: function(v) { this._values[1] = v || 0; },
    });

    prop(this, "y", {
      get: function() { return this._values[2]; },
      set: function(v) { this._values[2] = v || 0; },
    });
  }
);
