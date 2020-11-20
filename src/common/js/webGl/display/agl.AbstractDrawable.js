require("./agl.Item.js");
require("../NameSpace.js");

AGL.AbstractDrawable = helpers.createPrototypeClass(
  AGL.Item,
  function AbstractDrawable(texture) {
    AGL.Item.call(this);

    this._inverseMatrixCache = new Float32Array(6);

    this._corners = [
      AGL.Point.create(),
      AGL.Point.create(),
      AGL.Point.create(),
      AGL.Point.create()
    ];
  },
  function(_scope) {
    _scope.getCorners = function() {
      this._updateAdditionalData();
      return this._corners;
    }

    _scope.getBounds = function() {
      this._updateAdditionalData();
      return this._bounds;
    }

    _scope._calcBounds = function() {
      AGL.Matrix3.calcCorners(this.matrixCache, this._corners, this.stage);

      this._bounds.x = Math.min(
        this._corners[0].x,
        this._corners[1].x,
        this._corners[2].x,
        this._corners[3].x
      );
      this._bounds.y = Math.min(
        this._corners[0].y,
        this._corners[1].y,
        this._corners[2].y,
        this._corners[3].y
      );
      this._bounds.width = Math.max(
        this._corners[0].x,
        this._corners[1].x,
        this._corners[2].x,
        this._corners[3].x
      );
      this._bounds.height = Math.max(
        this._corners[0].y,
        this._corners[1].y,
        this._corners[2].y,
        this._corners[3].y
      );
    }

    _scope._updateAdditionalData = function() {
      if (this.stage && this._currentMatrixUpdateId < this._matrixUpdateId) {
        this._currentMatrixUpdateId = this._matrixUpdateId;
        AGL.Matrix3.inverse(this.matrixCache, this._inverseMatrixCache);
        this._calcBounds();
      }
    }
  }
);
