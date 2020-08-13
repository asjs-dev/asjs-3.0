require("../../NameSpace.js");
require("./webGl.AbstractProps.js");

WebGl.LightEffectProps = createPrototypeClass(
  WebGl.AbstractProps,
  function LightEffectProps() {
    WebGl.AbstractProps.call(this);
    this.items = [0, 0, 2, 2];
  },
  function() {
    prop(this, "anchorX", {
      get: function() { return this.items[0]; },
      set: function(v) {
        if (this.items[0] !== v) {
          this.items[0] = v;
          ++this.id;
        }
      }
    });

    prop(this, "anchorY", {
      get: function() { return this.items[1]; },
      set: function(v) {
        if (this.items[1] !== v) {
          this.items[1] = v;
          ++this.id;
        }
      }
    });

    prop(this, "quadX", {
      get: function() { return this.items[2]; },
      set: function(v) {
        if (this.items[2] !== v) {
          this.items[2] = v;
          ++this.id;
        }
      }
    });

    prop(this, "quadY", {
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
