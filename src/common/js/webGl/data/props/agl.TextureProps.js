require("../../NameSpace.js");
require("./agl.BasePositioningProps.js");

AGL.TextureProps = helpers.createPrototypeClass(
  AGL.BasePositioningProps,
  function TextureProps() {
    AGL.BasePositioningProps.call(this);

    this._width       =
    this._height      =
    this.scaledWidth  =
    this.scaledHeight = 1;
  },
  function(_scope) {
    helpers.property(_scope, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v) {
          this.scaledWidth = this._width = v;
          ++this.updateId;
        }
      }
    });

    helpers.property(_scope, "height", {
      get: function() { return this._height; },
      set: function(v) {
        if (this._height !== v) {
          this.scaledHeight = this._height = v;
          ++this.updateId;
        }
      }
    });
  }
);
