require("./agl.AbstractDrawable.js");
require("../NameSpace.js");

AGL.Light = helpers.createPrototypeClass(
  AGL.AbstractDrawable,
  function Light(
    id,
    lightData
  ) {
    AGL.AbstractDrawable.call(this);

    this.transition = 1;

    this.color.a = 0;

    this._matId = id * 16;

    this._lightData = lightData;
  },
  function(_scope, _super) {
    helpers.property(_scope, "on", {
      get: function() { return this.renderable && this.stage !== null; },
      set: function(v) { this.renderable = v; }
    });

    _scope._updateAdditionalData = function() {
      if (this.on && this._currentAdditionalPropsUpdateId < this.propsUpdateId) {
        this._currentAdditionalPropsUpdateId = this.propsUpdateId;
        this._calcBounds();
      }
    }

    _scope._calcCorners = function() {
      AGL.Matrix3.calcCorners(this.matrixCache, this._corners, this.stage);

      var corners = this._corners;

      var a = corners[0];
      var b = corners[1];
      var c = corners[2];
      var d = corners[3];

      a.x += (a.x - d.x) + (a.x - c.x);
      a.y += (a.y - d.y) + (a.y - c.y);
      c.x += (c.x - b.x);
      c.y += (c.y - b.y);
      d.x += (d.x - b.x);
      d.y += (d.y - b.y);
    }

    _scope.update = function(renderTime) {
      var lightData = this._lightData;
      var matId     = this._matId + 3;

      if (this.on) {
        this._updateProps(renderTime);
        this._updateColor();

        lightData[matId]      = lightData[matId + 8] > 0 ? 1 : 0;
        lightData[matId + 9]  = this.transition;
        lightData[matId + 10] = this.props.alpha;
      } else lightData[matId] = 0;
    }

    _scope._updateTransform = function(props, parent) {
      _super._updateTransform.call(this, props, parent);

      var inverseMatrixCache = this._inverseMatrixCache;

      AGL.Matrix3.inverse(this.matrixCache, inverseMatrixCache);

      var lightData = this._lightData;
      var matId     = this._matId;

      lightData[matId]     = inverseMatrixCache[4];
      lightData[matId + 1] = inverseMatrixCache[5];

      lightData[matId + 4] = inverseMatrixCache[0];
      lightData[matId + 5] = inverseMatrixCache[1];
      lightData[matId + 6] = inverseMatrixCache[2];
      lightData[matId + 7] = inverseMatrixCache[3];

      lightData[matId + 14] = ((-lightData[matId] / lightData[matId + 4]) + 1) / 2;
      lightData[matId + 15] = ((lightData[matId + 1] / lightData[matId + 7]) + 1) / 2;
    }

    _scope._updateColor = function() {
      var color = this.color;

      if (this._currentColorUpdateId < color.updateId) {
        this._currentColorUpdateId = color.updateId;

        var lightData        = this._lightData;
        var parentColorCache = this._parent.colorCache;
        var matId            = this._matId + 8;

        lightData[matId + 3] = parentColorCache[3] * color.a;
        lightData[matId]     = parentColorCache[0] * color.r * lightData[matId + 3];
        lightData[matId + 1] = parentColorCache[1] * color.g * lightData[matId + 3];
        lightData[matId + 2] = parentColorCache[2] * color.b * lightData[matId + 3];
      }
    }
  }
);
