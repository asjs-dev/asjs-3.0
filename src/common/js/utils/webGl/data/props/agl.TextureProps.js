require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.TextureProps = createPrototypeClass(
  AGL.AbstractProps,
  function TextureProps() {
    AGL.AbstractProps.call(this);

    this._sr = 0;
    this._cr = 1;

    this._x        = 0;
    this._y        = 0;
    this._rotation = 0;
    this._width    = 1;
    this._height   = 1;
    this._anchorX  = 0;
    this._anchorY  = 0;
  },
  function() {
    get(this, "sr", function() { return this._sr; });
    get(this, "cr", function() { return this._cr; });

    prop(this, "x", {
      get: function() { return this._x; },
      set: function(v) {
        if (this._x !== v) {
          this._x = v;
          ++this.id;
        }
      }
    });

    prop(this, "y", {
      get: function() { return this._y; },
      set: function(v) {
        if (this._y !== v) {
          this._y = v;
          ++this.id;
        }
      }
    });

    prop(this, "rotation", {
      get: function() { return this._rotation; },
      set: function(v) {
        if (this._rotation !== v) {
          this._rotation = v;
          this._sr = Math.sin(this._rotation);
          this._cr = Math.cos(this._rotation);
          ++this.id;
        }
      }
    });

    prop(this, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v) {
          this._width = v;
          ++this.id;
        }
      }
    });

    prop(this, "height", {
      get: function() { return this._height; },
      set: function(v) {
        if (this._height !== v) {
          this._height = v;
          ++this.id;
        }
      }
    });

    prop(this, "anchorX", {
      get: function() { return this._anchorX; },
      set: function(v) {
        if (this._anchorX !== v) {
          this._anchorX = v;
          ++this.id;
        }
      }
    });

    prop(this, "anchorY", {
      get: function() { return this._anchorY; },
      set: function(v) {
        if (this._anchorY !== v) {
          this._anchorY = v;
          ++this.id;
        }
      }
    });
  }
);
