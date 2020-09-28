require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.LightEffectProps = helpers.createPrototypeClass(
  AGL.AbstractProps,
  function LightEffectProps() {
    AGL.AbstractProps.call(this);

    this.items = [0, 0, 2, 2, 1];
  },
  function(_scope) {
    helpers.property(_scope, "anchorX", {
      get: function() { return this.items[0]; },
      set: function(v) {
        if (this.items[0] !== v) {
          this.items[0] = v;
          ++this._id;
        }
      }
    });

    helpers.property(_scope, "anchorY", {
      get: function() { return this.items[1]; },
      set: function(v) {
        if (this.items[1] !== v) {
          this.items[1] = v;
          ++this._id;
        }
      }
    });

    helpers.property(_scope, "quadX", {
      get: function() { return this.items[2]; },
      set: function(v) {
        if (this.items[2] !== v) {
          this.items[2] = v;
          ++this._id;
        }
      }
    });

    helpers.property(_scope, "quadY", {
      get: function() { return this.items[3]; },
      set: function(v) {
        if (this.items[3] !== v) {
          this.items[3] = v;
          ++this._id;
        }
      }
    });

    helpers.property(_scope, "transition", {
      get: function() { return 1 / this.items[4]; },
      set: function(v) {
        v = 1 / v;
        if (this.items[4] !== v) {
          this.items[4] = v;
          ++this._id;
        }
      }
    });
  }
);
