require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.TextureCrop = createPrototypeClass(
  AGL.AbstractProps,
  function TextureCrop() {
    AGL.AbstractProps.call(this);
    this._w = 1;
    this._h = 1;
    this._v = [0, 0, 1, 1];
    this.items = this._v;
  },
  function() {
    prop(this, "x", {
      get: function() { return this._v[0]; },
      set: function(v) {
        if (this._v[0] !== v) {
          this._v[0] = v;
          this._calcWidth();
          ++this._id;
        }
      }
    });

    prop(this, "y", {
      get: function() { return this._v[1]; },
      set: function(v) {
        if (this._v[1] !== v) {
          this._v[1] = v;
          this._calcHeight();
          ++this._id;
        }
      }
    });

    prop(this, "width", {
      get: function() { return this._w; },
      set: function(v) {
        if (this._w !== v) {
          this._w = v;
          this._calcWidth();
          ++this._id;
        }
      }
    });

    prop(this, "height", {
      get: function() { return this._h; },
      set: function(v) {
        if (this._h !== v) {
          this._h = v;
          this._calcHeight();
          ++this._id;
        }
      }
    });

    this._calcWidth = function() {
      this._v[2] = this._w - this._v[0];
    }

    this._calcHeight = function() {
      this._v[3] = this._h - this._v[1];
    }
  }
);
