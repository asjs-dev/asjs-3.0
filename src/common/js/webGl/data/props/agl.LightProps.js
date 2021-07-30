require("../../NameSpace.js");
require("./agl.ItemProps.js");

AGL.LightProps = helpers.createPrototypeClass(
  AGL.ItemProps,
  function LightProps() {
    AGL.ItemProps.call(this);

    this._z = 0;
  },
  function(_scope) {
    helpers.property(_scope, "z", {
      get: function() { return this._z; },
      set: function(v) {
        if (this._z !== v) this._z = v;
      }
    });
  }
);
