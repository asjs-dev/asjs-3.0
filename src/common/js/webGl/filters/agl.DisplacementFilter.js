require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.DisplacementFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function DisplacementFilter(texture, intensity, x, y) {
    AGL.BaseFilter.call(this, 6, 0, intensity);

    this.texture = texture;

    this.x = x;
    this.y = y;
  }, function(_scope) {
    helpers.property(_scope, "x", {
      get: function() { return this.v[1]; },
      set: function(v) { this.v[1] = v; }
    });

    helpers.property(_scope, "y", {
      get: function() { return this.v[2]; },
      set: function(v) { this.v[2] = v; }
    });
  }
);
