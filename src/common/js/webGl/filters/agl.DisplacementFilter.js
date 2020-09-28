require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.DisplacementFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function DisplacementFilter(texture, intensity, x, y) {
    AGL.AbstractFilter.call(this);

    this.type      = 5;
    this.texture   = texture;

    this.intensity = intensity;
    this.x         = x;
    this.y         = y;
  }, function(_scope) {
    helpers.property(_scope, "x", {
      get: function() { return this._values[1]; },
      set: function(v) { this._values[1] = v || 0; }
    });

    helpers.property(_scope, "y", {
      get: function() { return this._values[2]; },
      set: function(v) { this._values[2] = v || 0; }
    });
  }
);
