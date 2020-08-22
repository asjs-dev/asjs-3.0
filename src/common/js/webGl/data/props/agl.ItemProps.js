require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.ItemProps = createPrototypeClass(
  AGL.AbstractProps,
  function ItemProps() {
    AGL.AbstractProps.call(this);

    this._x        = 0;
    this._y        = 0;
    this._zIndex   = 0;
    this._rotation = 0;
    this._scaleX   = 1;
    this._scaleY   = 1;
    this._width    = 1;
    this._height   = 1;
    this._anchorX  = 0;
    this._anchorY  = 0;

    this._scaledWidth  = 1;
    this._scaledHeight = 1;
  },
  function() {
    get(this, "scaledWidth", function() { return this._scaledWidth; });
    get(this, "scaledHeight", function() { return this._scaledHeight; });

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

    prop(this, "zIndex", {
      get: function() { return this._zIndex; },
      set: function(v) { this._zIndex !== v && (this._zIndex = v); }
    });

    prop(this, "rotation", {
      get: function() { return this._rotation; },
      set: function(v) {
        if (this._rotation !== v) {
          this._rotation = v;
          ++this.id;
        }
      }
    });

    prop(this, "scaleX", {
      get: function() { return this._scaleX; },
      set: function(v) {
        if (this._scaleX !== v) {
          this._scaleX = v;
          this._updateScaledWidth();
          ++this.id;
        }
      }
    });

    prop(this, "scaleY", {
      get: function() { return this._scaleY; },
      set: function(v) {
        if (this._scaleY !== v) {
          this._scaleY = v;
          this._updateScaledHeight();
          ++this.id;
        }
      }
    });

    prop(this, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v) {
          this._width = v;
          this._updateScaledWidth();
          ++this.id;
        }
      }
    });

    prop(this, "height", {
      get: function() { return this._height; },
      set: function(v) {
        if (this._height !== v) {
          this._height = v;
          this._updateScaledHeight();
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

    this._updateScaledWidth = function() {
      this._scaledWidth = this._width * this._scaleX;
    }

    this._updateScaledHeight = function() {
      this._scaledHeight = this._height * this._scaleY;
    }
  }
);
