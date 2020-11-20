require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.DisplacementFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function DisplacementFilter(texture, intensity, x, y) {
    AGL.AbstractFilter.call(this, 5, 0, intensity);

    this.texture = texture;

    this.x = x;
    this.y = y;
  }, function(_scope) {
    helpers.property(_scope, "x", {
      get: function() { return this.values[1]; },
      set: function(v) { this.values[1] = v; }
    });

    helpers.property(_scope, "y", {
      get: function() { return this.values[2]; },
      set: function(v) { this.values[2] = v; }
    });
  }
);
