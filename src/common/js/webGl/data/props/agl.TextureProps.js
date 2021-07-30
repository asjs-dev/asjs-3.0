require("../../NameSpace.js");
require("./agl.BasePositioningProps.js");

AGL.TextureProps = helpers.createPrototypeClass(
  AGL.BasePositioningProps,
  function TextureProps() {
    AGL.BasePositioningProps.call(this);

    this._repeatX =
    this._repeatY = 1;
  },
  function(_scope) {
    helpers.get(_scope, "scaledWidth",  function() { return this._repeatX; });
    helpers.get(_scope, "scaledHeight", function() { return this._repeatY; });

    helpers.property(_scope, "repeatX", {
      get: function() { return this._repeatX; },
      set: function(v) {
        if (this._repeatX !== v) {
          this._repeatX = v;
          ++this.updateId;
        }
      }
    });

    helpers.property(_scope, "repeatY", {
      get: function() { return this._repeatY; },
      set: function(v) {
        if (this._repeatY !== v) {
          this._repeatY = v;
          ++this.updateId;
        }
      }
    });
  }
);
