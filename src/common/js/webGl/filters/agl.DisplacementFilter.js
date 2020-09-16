require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.DisplacementFilter = createPrototypeClass(
  AGL.AbstractFilter,
  function DisplacementFilter(texture, intensityX, intensityY, x, y) {
    AGL.AbstractFilter.call(this);

    this.type       = 6;
    this.texture    = texture;
    this.intensityX = intensityX;
    this.intensityY = intensityY;
    this.x          = x;
    this.y          = y;
  }, function() {
    prop(this, "intensityX", {
      get: function() { return this._vals[0]; },
      set: function(v) { this._vals[0] = v || 0; },
    });

    prop(this, "intensityY", {
      get: function() { return this._vals[1]; },
      set: function(v) { this._vals[1] = v || 0; },
    });

    prop(this, "x", {
      get: function() { return this._vals[2]; },
      set: function(v) { this._vals[2] = v || 0; },
    });

    prop(this, "y", {
      get: function() { return this._vals[3]; },
      set: function(v) { this._vals[3] = v || 0; },
    });
  }
);
