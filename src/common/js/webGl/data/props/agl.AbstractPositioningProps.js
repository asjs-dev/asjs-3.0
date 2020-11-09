require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.AbstractPositioningProps = helpers.createPrototypeClass(
  AGL.AbstractProps,
  function AbstractPositioningProps() {
    AGL.AbstractProps.call(this);

    this._rotationUpdateId            =
    this._currentSinRotationUpdateId  =
    this._currentCosRotationUpdateId  =

    this._sinRotation =

    this._x        =
    this._y        =
    this._z        =
    this._rotation =
    this._anchorX  =
    this._anchorY  = 0;

    this._cosRotation = 1;
  },
  function(_scope) {
    helpers.get(_scope, "sinRotation", function() {
      if (this._currentSinRotationUpdateId < this._rotationUpdateId) {
        this._currentSinRotationUpdateId = this._rotationUpdateId;
        this._sinRotation = Math.sin(this._rotation);
      }
      return this._sinRotation;
    });

    helpers.get(_scope, "cosRotation", function() {
      if (this._currentCosRotationUpdateId < this._rotationUpdateId) {
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
          ++this.updateId;
        }
      }
    });

    helpers.property(_scope, "y", {
      get: function() { return this._y; },
      set: function(v) {
        if (this._y !== v) {
          this._y = v;
          ++this.updateId;
        }
      }
    });

    helpers.property(_scope, "z", {
      get: function() { return this._z; },
      set: function(v) {
        if (this._z !== v) {
          this._z = v;
          ++this.updateId;
        }
      }
    });

    helpers.property(_scope, "rotation", {
      get: function() { return this._rotation; },
      set: function(v) {
        if (this._rotation !== v) {
          this._rotation = v;
          ++this._rotationUpdateId;
          ++this.updateId;
        }
      }
    });

    helpers.property(_scope, "anchorX", {
      get: function() { return this._anchorX; },
      set: function(v) {
        if (this._anchorX !== v) {
          this._anchorX = v;
          ++this.updateId;
        }
      }
    });

    helpers.property(_scope, "anchorY", {
      get: function() { return this._anchorY; },
      set: function(v) {
        if (this._anchorY !== v) {
          this._anchorY = v;
          ++this.updateId;
        }
      }
    });
  }
);
