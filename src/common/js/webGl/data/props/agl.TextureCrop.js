require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.TextureCrop = helpers.createPrototypeClass(
  AGL.AbstractProps,
  function TextureCrop() {
    AGL.AbstractProps.call(this);

    this.items = [0, 0, 1, 1];

    this._width  =
    this._height = 1;
  },
  function() {
    helpers.property(this, "x", {
      get: function() { return this.items[0]; },
      set: function(v) {
        if (this.items[0] !== v) {
          this.items[0] = v;
          this._calcWidth();
          ++this._id;
        }
      }
    });

    helpers.property(this, "y", {
      get: function() { return this.items[1]; },
      set: function(v) {
        if (this.items[1] !== v) {
          this.items[1] = v;
          this._calcHeight();
          ++this._id;
        }
      }
    });

    helpers.property(this, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v) {
          this._width = v;
          this._calcWidth();
          ++this._id;
        }
      }
    });

    helpers.property(this, "height", {
      get: function() { return this._height; },
      set: function(v) {
        if (this._height !== v) {
          this._height = v;
          this._calcHeight();
          ++this._id;
        }
      }
    });

    this._calcWidth = function() {
      this.items[2] = this._width - this.items[0];
    }

    this._calcHeight = function() {
      this.items[3] = this._height - this.items[1];
    }
  }
);
