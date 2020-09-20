require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.ItemProps = helpers.createPrototypeClass(
  AGL.AbstractProps,
  function ItemProps() {
    AGL.AbstractProps.call(this);

    this._scaledWidthUpdateId         =
    this._currentScaledWidthUpdateId  =

    this._scaledHeightUpdateId        =
    this._currentScaledHeightUpdateId =

    this._rotationUpdateId            =
    this._currentSinRotationUpdateId  =
    this._currentCosRotationUpdateId  = 0;

    this._scaledWidth  =
    this._scaledHeight = 1;

    this._sinRotation = 0;
    this._cosRotation = 1;

    this._x        =
    this._y        =
    this._zIndex   =
    this._rotation =
    this._anchorX  =
    this._anchorY  = 0;
    this._scaleX   =
    this._scaleY   =
    this._width    =
    this._height   = 1;
  },
  function() {
    helpers.get(this, "scaledWidth", function() {
      if (this._currentScaledWidthUpdateId !== this._scaledWidthUpdateId) {
        this._currentScaledWidthUpdateId = this._scaledWidthUpdateId;
        this._scaledWidth = this._width * this._scaleX;
      }
      return this._scaledWidth;
    });

    helpers.get(this, "scaledHeight", function() {
      if (this._currentScaledHeightUpdateId !== this._scaledHeightUpdateId) {
        this._currentScaledHeightUpdateId = this._scaledHeightUpdateId;
        this._scaledHeight = this._height * this._scaleY;
      }
      return this._scaledHeight;
    });

    helpers.get(this, "sinR", function() {
      if (this._currentSinRotationUpdateId !== this._rotationUpdateId) {
        this._currentSinRotationUpdateId = this._rotationUpdateId;
        this._sinRotation = Math.sin(this._rotation);
      }
      return this._sinRotation;
    });

    helpers.get(this, "cosR", function() {
      if (this._currentCosRotationUpdateId !== this._rotationUpdateId) {
        this._currentCosRotationUpdateId = this._rotationUpdateId;
        this._cosRotation = Math.cos(this._rotation);
      }
      return this._cosRotation;
    });

    helpers.property(this, "x", {
      get: function() { return this._x; },
      set: function(v) {
        if (this._x !== v) {
          this._x = v;
          ++this._id;
        }
      }
    });

    helpers.property(this, "y", {
      get: function() { return this._y; },
      set: function(v) {
        if (this._y !== v) {
          this._y = v;
          ++this._id;
        }
      }
    });

    helpers.property(this, "zIndex", {
      get: function() { return this._zIndex; },
      set: function(v) { this._zIndex !== v && (this._zIndex = v); }
    });

    helpers.property(this, "rotation", {
      get: function() { return this._rotation; },
      set: function(v) {
        if (this._rotation !== v) {
          this._rotation = v;
          ++this._rotationUpdateId;
          ++this._id;
        }
      }
    });

    helpers.property(this, "scaleX", {
      get: function() { return this._scaleX; },
      set: function(v) {
        if (this._scaleX !== v) {
          this._scaleX = v;
          ++this._scaledWidthUpdateId;
          ++this._id;
        }
      }
    });

    helpers.property(this, "scaleY", {
      get: function() { return this._scaleY; },
      set: function(v) {
        if (this._scaleY !== v) {
          this._scaleY = v;
          ++this._scaledHeightUpdateId;
          ++this._id;
        }
      }
    });

    helpers.property(this, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v) {
          this._width = v;
          ++this._scaledWidthUpdateId;
          ++this._id;
        }
      }
    });

    helpers.property(this, "height", {
      get: function() { return this._height; },
      set: function(v) {
        if (this._height !== v) {
          this._height = v;
          ++this._scaledHeightUpdateId;
          ++this._id;
        }
      }
    });

    helpers.property(this, "anchorX", {
      get: function() { return this._anchorX; },
      set: function(v) {
        if (this._anchorX !== v) {
          this._anchorX = v;
          ++this._id;
        }
      }
    });

    helpers.property(this, "anchorY", {
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
