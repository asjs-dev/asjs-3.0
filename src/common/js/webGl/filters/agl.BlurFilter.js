require("../NameSpace.js");
require("./agl.AbstractFilter.js");

AGL.BlurFilter = createPrototypeClass(
  AGL.AbstractFilter,
  function BlurFilter(blurX, blurY) {
    AGL.AbstractFilter.call(this);

    this.type = 3;
    this.blurX = blurX;
    this.blurY = blurY;
  },
  function() {
    prop(this, "blurX", {
      get: function() { return this._vals[0]; },
      set: function(v) { this._vals[0] = v; },
    });

    prop(this, "blurY", {
      get: function() { return this._vals[1]; },
      set: function(v) { this._vals[1] = v; },
    });
  }
);