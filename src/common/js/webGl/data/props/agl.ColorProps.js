require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.ColorProps = createPrototypeClass(
  AGL.AbstractProps,
  function ColorProps() {
    AGL.AbstractProps.call(this);
    this._v = [1, 1, 1, 1];
    this.items = this._v;
  },
  function() {
    prop(this, "r", {
      get: function() { return this._v[0]; },
      set: function(v) {
        if (this._v[0] !== v) {
          this._v[0] = v;
          ++this._id;
        }
      }
    });

    prop(this, "g", {
      get: function() { return this._v[1]; },
      set: function(v) {
        if (this._v[1] !== v) {
          this._v[1] = v;
          ++this._id;
        }
      }
    });

    prop(this, "b", {
      get: function() { return this._v[2]; },
      set: function(v) {
        if (this._v[2] !== v) {
          this._v[2] = v;
          ++this._id;
        }
      }
    });

    prop(this, "a", {
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
