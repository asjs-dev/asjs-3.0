require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.TintFilter = createPrototypeClass(
  AGL.AbstractColorFilter,
  function TintFilter(r, g, b) {
    AGL.AbstractColorFilter.call(this, 4);

    this.r = r;
    this.g = g;
    this.b = b;
  },
  function() {
    prop(this, "r", {
      get: function() { return this._values[0]; },
      set: function(v) { this._values[0] = v; }
    });

    prop(this, "g", {
      get: function() { return this._values[1]; },
      set: function(v) { this._values[1] = v; }
    });

    prop(this, "b", {
      get: function() { return this._values[2]; },
      set: function(v) { this._values[2] = v; }
    });
  }
);
