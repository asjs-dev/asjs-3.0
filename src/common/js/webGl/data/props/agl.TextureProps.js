require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.TextureProps = createPrototypeClass(
  AGL.AbstractProps,
  function TextureProps() {
    AGL.AbstractProps.call(this);

    this._rotationUpdateId           = 0;
    this._currentSinRotationUpdateId = -1;
    this._currentCosRotationUpdateId = -1;

    this._sinRotation = 0;
    this._cosRotation = 1;

    this._x        = 0;
    this._y        = 0;
    this._rotation = 0;
    this._width    = 1;
    this._height   = 1;
    this._anchorX  = 0;
    this._anchorY  = 0;
  },
  function() {
    get(this, "scaledWidth", function() { return this._width; });
    get(this, "scaledHeight", function() { return this._height; });

    get(this, "sinR", function() {
      if (this._currentSinRotationUpdateId !== this._rotationUpdateId) {
        this._currentSinRotationUpdateId = this._rotationUpdateId;
        this._sinRotation = Math.sin(this._rotation);
      }
      return this._sinRotation;
    });

    get(this, "cosR", function() {
      if (this._currentCosRotationUpdateId !== this._rotationUpdateId) {
        this._currentCosRotationUpdateId = this._rotationUpdateId;
        this._cosRotation = Math.cos(this._rotation);
      }
      return this._cosRotation;
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
      get: function() { return this._rotation; },
      set: function(v) {
        if (this._rotation !== v) {
          this._rotation = v;
          ++this._rotationUpdateId;
          ++this._id;
        }
      }
    });

    prop(this, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v) {
          this._width = v;
          ++this._id;
        }
      }
    });

    prop(this, "height", {
      get: function() { return this._height; },
      set: function(v) {
        if (this._height !== v) {
          this._height = v;
          ++this._id;
        }
      }
    });

    prop(this, "anchorX", {
      get: function() { return this._anchorX; },
      set: function(v) {
        if (this._anchorX !== v) {
          this._anchorX = v;
          ++this._id;
        }
      }
    });

    prop(this, "anchorY", {
      get: function() { return this._anchorY; },
      set: function(v) {
        if (this._anchorY !== v) {
          this._anchorY = v;
          ++this._id;
        }
      }
    });
  }
);
