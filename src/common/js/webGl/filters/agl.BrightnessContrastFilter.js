require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.BrightnessContrastFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function BrightnessContrastFilter(brightness, contrast) {
    AGL.AbstractFilter.call(this, 2, 8, brightness);

    this.contrast = contrast;
  },
  function(_scope) {
    helpers.property(_scope, "brightness", {
      get: function() { return this.v[0]; },
      set: function(v) { this.v[0] = v; }
    });

    helpers.property(_scope, "contrast", {
      get: function() { return this.v[1]; },
      set: function(v) { this.v[1] = v; }
    });
  }
);
