require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.TintFilter = helpers.createPrototypeClass(
  AGL.AbstractColorFilter,
  function TintFilter(r, g, b) {
    AGL.AbstractColorFilter.call(this, 4);

    this.r = r;
    this.g = g;
    this.b = b;
  },
  function() {
    helpers.property(this, "r", {
      get: function() { return this._values[0]; },
      set: function(v) { this._values[0] = v; }
    });

    helpers.property(this, "g", {
      get: function() { return this._values[1]; },
      set: function(v) { this._values[1] = v; }
    });

    helpers.property(this, "b", {
      get: function() { return this._values[2]; },
      set: function(v) { this._values[2] = v; }
    });
  }
);
