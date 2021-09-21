require("../../NameSpace.js");
require("./agl.BaseProps.js");

AGL.ColorProps = helpers.createPrototypeClass(
  AGL.BaseProps,
  function ColorProps() {
    AGL.BaseProps.call(this);

    this.items = [1, 1, 1, 1];
  },
  function(_scope) {
    helpers.property(_scope, "r", {
      get: function() { return this.items[0]; },
      set: function(v) {
        if (this.items[0] !== v) {
          this.items[0] = v;
          ++this.updateId;
        }
      }
    });

    helpers.property(_scope, "g", {
      get: function() { return this.items[1]; },
      set: function(v) {
        if (this.items[1] !== v) {
          this.items[1] = v;
          ++this.updateId;
        }
      }
    });

    helpers.property(_scope, "b", {
      get: function() { return this.items[2]; },
      set: function(v) {
        if (this.items[2] !== v) {
          this.items[2] = v;
          ++this.updateId;
        }
      }
    });

    helpers.property(_scope, "a", {
      get: function() { return this.items[3]; },
      set: function(v) {
        if (this.items[3] !== v) {
          this.items[3] = v;
          ++this.updateId;
        }
      }
    });

    _scope.set = function(r, g, b, a) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }
  }
);
