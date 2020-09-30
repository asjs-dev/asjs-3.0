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
    this._z        =
    this._rotation =
    this._anchorX  =
    this._anchorY  = 0;
    this._scaleX   =
    this._scaleY   =
    this._width    =
    this._height   = 1;
  },
  function(_scope) {
    helpers.get(_scope, "scaledWidth", function() {
      if (this._currentScaledWidthUpdateId !== this._scaledWidthUpdateId) {
        this._currentScaledWidthUpdateId = this._scaledWidthUpdateId;
        this._scaledWidth = this._width * this._scaleX;
      }
      return this._scaledWidth;
    });

    helpers.get(_scope, "scaledHeight", function() {
      if (this._currentScaledHeightUpdateId !== this._scaledHeightUpdateId) {
        this._currentScaledHeightUpdateId = this._scaledHeightUpdateId;
        this._scaledHeight = this._height * this._scaleY;
      }
      return this._scaledHeight;
    });

    helpers.get(_scope, "sinR", function() {
      if (this._currentSinRotationUpdateId !== this._rotationUpdateId) {
        this._currentSinRotationUpdateId = this._rotationUpdateId;
        this._sinRotation = Math.sin(this._rotation);
      }
      return this._sinRotation;
    });

    helpers.get(_scope, "cosR", function() {
      if (this._currentCosRotationUpdateId !== this._rotationUpdateId) {
        this._currentCosRotationUpdateId = this._rotationUpdateId;
        this._cosRotation = Math.cos(this._rotation);
      }
      return this._cosRotation;
    });

    helpers.property(_scope, "x", {
      get: function() { return this._x; },
      set: function(v) {
        if (this._x !== v) {
          this._x = v;
          ++this._id;
        }
      }
    });

    helpers.property(_scope, "y", {
      get: function() { return this._y; },
      set: function(v) {
        if (this._y !== v) {
          this._y = v;
          ++this._id;
        }
      }
    });

    helpers.property(_scope, "z", {
      get: function() { return this._z; },
      set: function(v) {
        if (this._z !== v) {
          this._z = v;
          ++this._id;
        }
      }
    });

    helpers.property(_scope, "rotation", {
      get: function() { return this._rotation; },
      set: function(v) {
        if (this._rotation !== v) {
          this._rotation = v;
          ++this._rotationUpdateId;
          ++this._id;
        }
      }
    });

    helpers.property(_scope, "scaleX", {
      get: function() { return this._scaleX; },
      set: function(v) {
        if (this._scaleX !== v) {
          this._scaleX = v;
          ++this._scaledWidthUpdateId;
          ++this._id;
        }
      }
    });

    helpers.property(_scope, "scaleY", {
      get: function() { return this._scaleY; },
      set: function(v) {
        if (this._scaleY !== v) {
          this._scaleY = v;
          ++this._scaledHeightUpdateId;
          ++this._id;
        }
      }
    });

    helpers.property(_scope, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v) {
          this._width = v;
          ++this._scaledWidthUpdateId;
          ++this._id;
        }
      }
    });

    helpers.property(_scope, "height", {
      get: function() { return this._height; },
      set: function(v) {
        if (this._height !== v) {
          this._height = v;
          ++this._scaledHeightUpdateId;
          ++this._id;
        }
      }
    });

    helpers.property(_scope, "anchorX", {
      get: function() { return this._anchorX; },
      set: function(v) {
        if (this._anchorX !== v) {
          this._anchorX = v;
          ++this._id;
        }
      }
    });

    helpers.property(_scope, "anchorY", {
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
