require("../../NameSpace.js");
require("./agl.AbstractPositioningProps.js");

AGL.TextureProps = helpers.createPrototypeClass(
  AGL.AbstractPositioningProps,
  function TextureProps() {
    AGL.AbstractPositioningProps.call(this);

    this._width  =
    this._height = 1;
  },
  function(_scope) {
    helpers.get(_scope, "scaledWidth", function() { return this._width; });
    helpers.get(_scope, "scaledHeight", function() { return this._height; });

    helpers.property(_scope, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v) {
          this._width = v;
          ++this.updateId;
        }
      }
    });

    helpers.property(_scope, "height", {
      get: function() { return this._height; },
      set: function(v) {
        if (this._height !== v) {
          this._height = v;
          ++this.updateId;
        }
      }
    });
  }
);
