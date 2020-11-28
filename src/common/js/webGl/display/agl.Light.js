require("./agl.AbstractDrawable.js");
require("../NameSpace.js");

AGL.Light = helpers.createPrototypeClass(
  AGL.AbstractDrawable,
  function Light(
    id,
    lightPositions,
    lightVolumes,
    lightColors,
    lightEffects
  ) {
    AGL.AbstractDrawable.call(this);

    this.transition = 1;

    this.color.a                     =
    this._currentParentPropsUpdateId = 0;

    this._duoId  = id * 2;
    this._tripId = id * 3;
    this._quadId = id * 4;

    this._lightPositions = lightPositions;
    this._lightVolumes   = lightVolumes;
    this._lightColors    = lightColors;
    this._lightEffects   = lightEffects;

    this.colorCache = [1, 1, 1, 1];

    this.update;
    this.on = false;
  },
  function(_scope, _super) {
    helpers.property(_scope, "on", {
      get: function() { return this._on && this.stage; },
      set: function(v) {
        if (this._on !== v) {
          this._on = v;
          if (this._on) this.update = this._update;
          else {
            this.update = helpers.emptyFunction;
            this._lightColors[this._quadId + 3] = 0;
          }
        }
      }
    });

    _scope._updateAdditionalData = function() {
      if (this.stage && this._currentAdditionalPropsUpdateId < this.propsUpdateId) {
        this._currentAdditionalPropsUpdateId = this.propsUpdateId;
        this._calcBounds();
      }
    }

    _scope._update = function(renderTime) {
      this._updateProps();
      this._updateColor();
      this._lightEffects[this._duoId]     = this.transition;
      this._lightEffects[this._duoId + 1] = this.props.alpha;
    }

    _scope._updateTransform = function() {
      _super._updateTransform.call(this);

      var inverseMatrixCache = this._inverseMatrixCache;
      var lightPositions     = this._lightPositions;
      var lightVolumes       = this._lightVolumes;

      AGL.Matrix3.inverse(this.matrixCache, inverseMatrixCache);

      lightPositions[this._tripId]     = inverseMatrixCache[4];
      lightPositions[this._tripId + 1] = inverseMatrixCache[5];
      lightPositions[this._tripId + 2] = this.props.z;

      lightVolumes[this._quadId]     = inverseMatrixCache[0];
      lightVolumes[this._quadId + 1] = inverseMatrixCache[1];
      lightVolumes[this._quadId + 2] = inverseMatrixCache[2];
      lightVolumes[this._quadId + 3] = inverseMatrixCache[3];
    }

    _scope._updateColor = function() {
      var color = this.color;

      if (this._currentColorUpdateId < color.updateId) {
        this._currentColorUpdateId = color.updateId;

        var colorCache       = this.colorCache;
        var parentColorCache = this._parent.colorCache;

        colorCache[3] = parentColorCache[3] * color.a;
        colorCache[0] = parentColorCache[0] * color.r * colorCache[3];
        colorCache[1] = parentColorCache[1] * color.g * colorCache[3];
        colorCache[2] = parentColorCache[2] * color.b * colorCache[3];

        helpers.arraySet(this._lightColors, colorCache, this._quadId);
      }
    }
  }
);
