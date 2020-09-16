require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.DisplacementFilter = createPrototypeClass(
  AGL.AbstractFilter,
  function DisplacementFilter(texture, intensity) {
    AGL.AbstractFilter.call(this);
console.log(this);
    this.type      = 6;
    this.texture   = texture;
    this.intensity = intensity;
  }, function() {
    prop(this, "x", {
      get: function() { return this._vals[1]; },
      set: function(v) { this._vals[1] = v; },
    });

    prop(this, "y", {
      get: function() { return this._vals[2]; },
      set: function(v) { this._vals[2] = v; },
    });
  }
);
