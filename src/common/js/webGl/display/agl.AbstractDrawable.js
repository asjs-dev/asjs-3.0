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

    _scope._calcCorners = function() {
      AGL.Matrix3.calcCorners(this.matrixCache, this._corners, this.stage);
    }

    _scope._calcBounds = function() {
      this._calcCorners();
      
      var corners = this._corners;
      var bounds = this._bounds;

      var a = corners[0];
      var b = corners[1];
      var c = corners[2];
      var d = corners[3];

      bounds.x      = Math.min(a.x, b.x, c.x, d.x);
      bounds.y      = Math.min(a.y, b.y, c.y, d.y);
      bounds.width  = Math.max(a.x, b.x, c.x, d.x);
      bounds.height = Math.max(a.y, b.y, c.y, d.y);
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
