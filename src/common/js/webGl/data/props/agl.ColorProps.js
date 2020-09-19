require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.ColorProps = createPrototypeClass(
  AGL.AbstractProps,
  function ColorProps() {
    AGL.AbstractProps.call(this);

    this.items = [1, 1, 1, 1];
  },
  function() {
    prop(this, "r", {
      get: function() { return this.items[0]; },
      set: function(v) {
        if (this.items[0] !== v) {
          this.items[0] = v;
          ++this._id;
        }
      }
    });

    prop(this, "g", {
      get: function() { return this.items[1]; },
      set: function(v) {
        if (this.items[1] !== v) {
          this.items[1] = v;
          ++this._id;
        }
      }
    });

    prop(this, "b", {
      get: function() { return this.items[2]; },
      set: function(v) {
        if (this.items[2] !== v) {
          this.items[2] = v;
          ++this._id;
        }
      }
    });

    prop(this, "a", {
      get: function() { return this.items[3]; },
      set: function(v) {
        if (this.items[3] !== v) {
          this.items[3] = v;
          ++this._id;
        }
      }
    });
  }
);
