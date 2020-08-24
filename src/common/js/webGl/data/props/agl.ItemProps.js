require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.ItemProps = createPrototypeClass(
  AGL.AbstractProps,
  function ItemProps() {
    AGL.AbstractProps.call(this);

    this._sWUId    = 0;
    this._curSWUId = -1;

    this._sHUId    = 0;
    this._curSHUId = -1;

    this._rUId     = 0;
    this._curSRUId = -1;
    this._curCRUId = -1;

    this._sW = 1;
    this._sH = 1;

    this._sr = 0;
    this._cr = 1;

    this._x   = 0;
    this._y   = 0;
    this._zId = 0;
    this._r   = 0;
    this._sX  = 1;
    this._sY  = 1;
    this._w   = 1;
    this._h   = 1;
    this._aX  = 0;
    this._aY  = 0;
  },
  function() {
    get(this, "scaledWidth", function() {
      if (this._curSWUId !== this._sWUId) {
        this._curSWUId = this._sWUId;
        this._sW = this._w * this._sX;
      }
      return this._sW;
    });

    get(this, "scaledHeight", function() {
      if (this._curSHUId !== this._sHUId) {
        this._curSHUId = this._sHUId;
        this._sH = this._h * this._sY;
      }
      return this._sH;
    });

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

    get(this, "scaledHeight", function() {
      if (this._curSHUId !== this._sHUId) {
        this._curSHUId = this._sHUId;
        this._sH = this._h * this._sY;
      }
      return this._sH;
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

    prop(this, "zIndex", {
      get: function() { return this._zId; },
      set: function(v) { this._zId !== v && (this._zId = v); }
    });

    prop(this, "rotation", {
      get: function() { return this._r; },
      set: function(v) {
        if (this._r !== v) {
          this._r = v;
          ++this._rUId;
          ++this._id;
        }
      }
    });

    prop(this, "scaleX", {
      get: function() { return this._sX; },
      set: function(v) {
        if (this._sX !== v) {
          this._sX = v;
          ++this._sWUId;
          ++this._id;
        }
      }
    });

    prop(this, "scaleY", {
      get: function() { return this._sY; },
      set: function(v) {
        if (this._sY !== v) {
          this._sY = v;
          ++this._sHUId;
          ++this._id;
        }
      }
    });

    prop(this, "width", {
      get: function() { return this._w; },
      set: function(v) {
        if (this._w !== v) {
          this._w = v;
          ++this._sWUId;
          ++this._id;
        }
      }
    });

    prop(this, "height", {
      get: function() { return this._h; },
      set: function(v) {
        if (this._h !== v) {
          this._h = v;
          ++this._sHUId;
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
