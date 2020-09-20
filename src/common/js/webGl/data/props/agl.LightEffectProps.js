require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.LightEffectProps = helpers.createPrototypeClass(
  AGL.AbstractProps,
  function LightEffectProps() {
    AGL.AbstractProps.call(this);

    this.items = [0, 0, 2, 2];
  },
  function() {
    helpers.property(this, "anchorX", {
      get: function() { return this.items[0]; },
      set: function(v) {
        if (this.items[0] !== v) {
          this.items[0] = v;
          ++this._id;
        }
      }
    });

    helpers.property(this, "anchorY", {
      get: function() { return this.items[1]; },
      set: function(v) {
        if (this.items[1] !== v) {
          this.items[1] = v;
          ++this._id;
        }
      }
    });

    helpers.property(this, "quadX", {
      get: function() { return this.items[2]; },
      set: function(v) {
        if (this.items[2] !== v) {
          this.items[2] = v;
          ++this._id;
        }
      }
    });

    helpers.property(this, "quadY", {
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
