require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.TextureProps = createPrototypeClass(
  AGL.AbstractProps,
  function TextureProps() {
    AGL.AbstractProps.call(this);

    this._rUId     = 0;
    this._curSRUId = -1;
    this._curCRUId = -1;

    this._sr = 0;
    this._cr = 1;

    this._x  = 0;
    this._y  = 0;
    this._r  = 0;
    this._w  = 1;
    this._h  = 1;
    this._aX = 0;
    this._aY = 0;
  },
  function() {
    get(this, "sinR", function() {
      if (this._curSRUId !== this._rUId) {
        this._curSRUId = this._rUId;
        this._sr = Math.sin(this._r);
      }
      return this._sr;
    });

    get(this, "cosR", function() {
      if (this._curCRUId !== this._rUId) {
        this._curCRUId = this._rUId;
        this._cr = Math.cos(this._r);
      }
      return this._cr;
    });

    prop(this, "x", {
      get: function() { return this._x; },
      set: function(v) {
        if (this._x !== v) {
          this._x = v;
          ++this._id;
        }
      }
    });

    prop(this, "y", {
      get: function() { return this._y; },
      set: function(v) {
        if (this._y !== v) {
          this._y = v;
          ++this._id;
        }
      }
    });

    prop(this, "rotation", {
      get: function() { return this.this._r; },
      set: function(v) {
        if (this.this._r !== v) {
          this.this._r = v;
          ++this._rUId;
          ++this._id;
        }
      }
    });

    prop(this, "width", {
      get: function() { return this._w; },
      set: function(v) {
        if (this._w !== v) {
          this._w = v;
          ++this._id;
        }
      }
    });

    prop(this, "height", {
      get: function() { return this._h; },
      set: function(v) {
        if (this._h !== v) {
          this._h = v;
          ++this._id;
        }
      }
    });

    prop(this, "anchorX", {
      get: function() { return this._aX; },
      set: function(v) {
        if (this._aX !== v) {
          this._aX = v;
          ++this._id;
        }
      }
    });

    prop(this, "anchorY", {
      get: function() { return this._aY; },
      set: function(v) {
        if (this._aY !== v) {
          this._aY = v;
          ++this._id;
        }
      }
    });
  }
);
