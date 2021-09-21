require("../NameSpace.js");
require("./agl.BaseFilter.js");

AGL.SaturateFilter = helpers.createPrototypeClass(
  AGL.BaseFilter,
  function SaturateFilter(intensity) {
    AGL.BaseFilter.call(this, 2, 0, intensity);
  },
  function(_scope) {
    helpers.property(_scope, "intensity", {
      get: function() { return this.v[0]; },
      set: function(v) {
        this.v[0] = v;

        var x = (v * 2 / 3) + 1;
        var y = ((x - 1) * - .5);

        helpers.arraySet(this.kernels, [
          x, y, y, 0,
          y, x, y, 0,
          y, y, x, 0
        ], 0);
      }
    });
  }
);
