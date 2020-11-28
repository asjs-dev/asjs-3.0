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
      var corners = this._corners;
      AGL.Matrix3.calcCorners(this.matrixCache, corners, this.stage);
      var bounds = this._bounds;
      bounds.x = Math.min(
        corners[0].x,
        corners[1].x,
        corners[2].x,
        corners[3].x
      );
      bounds.y = Math.min(
        corners[0].y,
        corners[1].y,
        corners[2].y,
        corners[3].y
      );
      bounds.width = Math.max(
        corners[0].x,
        corners[1].x,
        corners[2].x,
        corners[3].x
      );
      bounds.height = Math.max(
        corners[0].y,
        corners[1].y,
        corners[2].y,
        corners[3].y
      );
    }

    _scope._updateAdditionalData = function() {
      if (this.stage && this._currentAdditionalPropsUpdateId < this.propsUpdateId) {
        this._currentAdditionalPropsUpdateId = this.propsUpdateId;
        AGL.Matrix3.inverse(this.matrixCache, this._inverseMatrixCache);
        this._calcBounds();
      }
    }
  }
);
