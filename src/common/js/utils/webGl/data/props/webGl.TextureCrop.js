require("../../NameSpace.js");
require("./webGl.AbstractProps.js");

WebGl.TextureCrop = createPrototypeClass(
  WebGl.AbstractProps,
  function TextureCrop() {
    WebGl.AbstractProps.call(this);
    this.items = [0, 0, 1, 1];
  },
  function() {
    prop(this, "x", {
      get: function() { return this.items[0]; },
      set: function(v) {
        if (this.items[0] !== v) {
          this.items[0] = v;
          ++this.id;
        }
      }
    });

    prop(this, "y", {
      get: function() { return this.items[1]; },
      set: function(v) {
        if (this.items[1] !== v) {
          this.items[1] = v;
          ++this.id;
        }
      }
    });

    prop(this, "width", {
      get: function() { return this.items[2]; },
      set: function(v) {
        if (this.items[2] !== v) {
          this.items[2] = v;
          ++this.id;
        }
      }
    });

    prop(this, "height", {
      get: function() { return this.items[3]; },
      set: function(v) {
        if (this.items[3] !== v) {
          this.items[3] = v;
          ++this.id;
        }
      }
    });
  }
);
