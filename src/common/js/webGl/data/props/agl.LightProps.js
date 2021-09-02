require("../../NameSpace.js");
require("./agl.ItemProps.js");

AGL.LightProps = helpers.createPrototypeClass(
  AGL.ItemProps,
  function LightProps() {
    AGL.ItemProps.call(this);

    this.z = 0;
  },
  function(_scope) {
    helpers.property(_scope, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v) {
          this._width  =
          this._height = v;
          ++this._scaleUpdateId;
        }
      }
    });

    helpers.property(_scope, "height", {
      get: function() { return this._height; },
      set: helpers.emptyFunction
    });
  }
);
