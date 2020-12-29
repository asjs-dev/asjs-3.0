require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.TextureCrop = helpers.createPrototypeClass(
  AGL.AbstractProps,
  function TextureCrop() {
    AGL.AbstractProps.call(this);

    this._currentUpdateId = 0;

    this.items = [0, 0, 1, 1];

    this._width  =
    this._height = 1;
  },
  function(_scope) {
    helpers.property(_scope, "x", {
      get: function() { return this.items[0]; },
      set: function(v) {
        if (this.items[0] !== v) {
          this.items[0] = v;
          ++this.updateId;
        }
      }
    });

    helpers.property(_scope, "y", {
      get: function() { return this.items[1]; },
      set: function(v) {
        if (this.items[1] !== v) {
          this.items[1] = v;
          ++this.updateId;
        }
      }
    });

    helpers.property(_scope, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v) {
          this._width = v;
          ++this.updateId;
        }
      }
    });

    helpers.property(_scope, "height", {
      get: function() { return this._height; },
      set: function(v) {
        if (this._height !== v) {
          this._height = v;
          ++this.updateId;
        }
      }
    });

    _scope.updateCrop = function() {
      if (this._currentUpdateId < this.updateId) {
        this._currentUpdateId = this.updateId;

        this.items[2] = this._width  - this.items[0];
        this.items[3] = this._height - this.items[1];
      }
    }
  }
);
