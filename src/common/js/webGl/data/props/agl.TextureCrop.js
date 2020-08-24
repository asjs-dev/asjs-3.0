require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.TextureCrop = createPrototypeClass(
  AGL.AbstractProps,
  function TextureCrop() {
    AGL.AbstractProps.call(this);
    this._v = [0, 0, 1, 1];
    this.items = this._v;
  },
  function() {
    prop(this, "x", {
      get: function() { return this._v[0]; },
      set: function(v) {
        if (this._v[0] !== v) {
          this._v[0] = v;
          ++this._id;
        }
      }
    });

    prop(this, "y", {
      get: function() { return this._v[1]; },
      set: function(v) {
        if (this._v[1] !== v) {
          this._v[1] = v;
          ++this._id;
        }
      }
    });

    prop(this, "width", {
      get: function() { return this._v[2]; },
      set: function(v) {
        if (this._v[2] !== v) {
          this._v[2] = v;
          ++this._id;
        }
      }
    });

    prop(this, "height", {
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
