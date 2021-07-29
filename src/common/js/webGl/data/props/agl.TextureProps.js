require("../../NameSpace.js");
require("./agl.BasePositioningProps.js");

AGL.TextureProps = helpers.createPrototypeClass(
  AGL.BasePositioningProps,
  function TextureProps() {
    AGL.BasePositioningProps.call(this);

    this._repeatX     =
    this._repeatY     =
    this.scaledWidth  =
    this.scaledHeight = 1;
  },
  function(_scope) {
    helpers.property(_scope, "repeatX", {
      get: function() { return this._repeatX; },
      set: function(v) {
        if (this._repeatX !== v) {
          this.scaledWidth = this._repeatX = v;
          ++this.updateId;
        }
      }
    });

    helpers.property(_scope, "repeatY", {
      get: function() { return this._repeatY; },
      set: function(v) {
        if (this._repeatY !== v) {
          this.scaledHeight = this._repeatY = v;
          ++this.updateId;
        }
      }
    });
  }
);
