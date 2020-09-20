require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.BlurFilter = helpers.createPrototypeClass(
  AGL.AbstractFilter,
  function BlurFilter(blurX, blurY) {
    AGL.AbstractFilter.call(this);

    this.type  = 3;
    this.blurX = blurX;
    this.blurY = blurY;
  },
  function() {
    helpers.property(this, "blurX", {
      get: function() { return this._values[0]; },
      set: function(v) { this._values[0] = v; },
    });

    helpers.property(this, "blurY", {
      get: function() { return this._values[1]; },
      set: function(v) { this._values[1] = v; },
    });
  }
);
