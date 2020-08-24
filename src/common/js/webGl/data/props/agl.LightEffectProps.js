require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.LightEffectProps = createPrototypeClass(
  AGL.AbstractProps,
  function LightEffectProps() {
    AGL.AbstractProps.call(this);
    this._v = [0, 0, 2, 2];
    this.items = this._v;
  },
  function() {
    prop(this, "anchorX", {
      get: function() { return this._v[0]; },
      set: function(v) {
        if (this._v[0] !== v) {
          this._v[0] = v;
          ++this._id;
        }
      }
    });

    prop(this, "anchorY", {
      get: function() { return this._v[1]; },
      set: function(v) {
        if (this._v[1] !== v) {
          this._v[1] = v;
          ++this._id;
        }
      }
    });

    prop(this, "quadX", {
      get: function() { return this._v[2]; },
      set: function(v) {
        if (this._v[2] !== v) {
          this._v[2] = v;
          ++this._id;
        }
      }
    });

    prop(this, "quadY", {
      get: function() { return this._v[3]; },
      set: function(v) {
        if (this._v[3] !== v) {
          this._v[3] = v;
          ++this._id;
        }
      }
    });
  }
);
