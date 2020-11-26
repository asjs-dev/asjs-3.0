require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.AbstractPositioningProps = helpers.createPrototypeClass(
  AGL.AbstractProps,
  function AbstractPositioningProps() {
    AGL.AbstractProps.call(this);

    this._rotationUpdateId        =
    this._currentRotationUpdateId =

    this._sinRotationA =
    this._sinRotationB =

    this._x        =
    this._y        =
    this._z        =
    this._rotation =
    this._anchorX  =
    this._anchorY  =
    this._skewX    =
    this._skewY    = 0;

    this._cosRotationA =
    this._cosRotationB = 1;
  },
  function(_scope) {
    helpers.get(_scope, "sinRotationA", function() {
      this._updateRotations();
      return this._sinRotationA;
    });

    helpers.get(_scope, "cosRotationA", function() {
      this._updateRotations();
      return this._cosRotationA;
    });

    helpers.get(_scope, "sinRotationB", function() {
      this._updateRotations();
      return this._sinRotationB;
    });

    helpers.get(_scope, "cosRotationB", function() {
      this._updateRotations();
      return this._cosRotationB;
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

    helpers.property(_scope, "skewX", {
      get: function() { return this._skewX; },
      set: function(v) {
        if (this._skewX !== v) {
          this._skewX = v;
          ++this._rotationUpdateId;
          ++this.updateId;
        }
      }
    });

    helpers.property(_scope, "skewY", {
      get: function() { return this._skewY; },
      set: function(v) {
        if (this._skewY !== v) {
          this._skewY = v;
          ++this._rotationUpdateId;
          ++this.updateId;
        }
      }
    });

    _scope._updateRotations = function() {
      if (this._currentRotationUpdateId < this._rotationUpdateId) {
        this._currentRotationUpdateId = this._rotationUpdateId;
        this._sinRotationA = Math.sin(this._rotation + this._skewY);
        this._cosRotationA = Math.cos(this._rotation + this._skewY);
        this._sinRotationB = Math.sin(this._rotation - this._skewX);
        this._cosRotationB = Math.cos(this._rotation - this._skewX);
      }
    }
  }
);
