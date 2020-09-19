require("../NameSpace.js");
require("./agl.AbstractColorFilter.js");

AGL.BrightnessContrastFilter = createPrototypeClass(
  AGL.AbstractColorFilter,
  function BrightnessContrastFilter(brightness, contrast) {
    AGL.AbstractColorFilter.call(this, 9);

    this.brightness = brightness;
    this.contrast   = contrast;
  },
  function() {
    prop(this, "brightness", {
      get: function() { return this._values[0]; },
      set: function(v) { this._values[0] = v; }
    });

    prop(this, "contrast", {
      get: function() { return this._values[1]; },
      set: function(v) { this._values[1] = v; }
    });
  }
);
