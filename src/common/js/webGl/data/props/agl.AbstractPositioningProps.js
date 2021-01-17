require("../../NameSpace.js");
require("./agl.AbstractProps.js");

AGL.AbstractPositioningProps = helpers.createPrototypeClass(
  AGL.AbstractProps,
  function AbstractPositioningProps() {
    AGL.AbstractProps.call(this);

    this._rotationUpdateId        =
    this._currentRotationUpdateId =

    this.sinRotationA =
    this.sinRotationB =

    this._x        =
    this._y        =
    this._z        =
    this._rotation =
    this._anchorX  =
    this._anchorY  =
    this._skewX    =
    this._skewY    = 0;

    this.cosRotationA =
    this.cosRotationB = 1;
  },
  function(_scope) {
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
        }
      }
    });

    helpers.property(_scope, "skewY", {
      get: function() { return this._skewY; },
      set: function(v) {
        if (this._skewY !== v) {
          this._skewY = v;
          ++this._rotationUpdateId;
        }
      }
    });

    _scope.updateRotation = function() {
      if (this._currentRotationUpdateId < this._rotationUpdateId) {
        this._currentRotationUpdateId = this._rotationUpdateId;
        ++this.updateId;
        /*
        if (this._skewX === 0 && this._skewY === 0) {
          this.sinRotationA =
          this.sinRotationB = Math.sin(this._rotation);
          this.cosRotationA =
          this.cosRotationB = Math.cos(this._rotation);
        } else {
        */
          var rotSkewX = this._rotation - this._skewX;
          var rotSkewY = this._rotation + this._skewY;

          this.sinRotationA = Math.sin(rotSkewY);
          this.cosRotationA = Math.cos(rotSkewY);
          this.sinRotationB = Math.sin(rotSkewX);
          this.cosRotationB = Math.cos(rotSkewX);
        //}
      }
    }
  }
);
