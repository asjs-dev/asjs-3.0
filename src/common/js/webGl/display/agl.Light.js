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
      AGL.Matrix3.inverse(this.matrixCache, this._inverseMatrixCache);

      this._lightPositions[this._tripId]     = this._inverseMatrixCache[4];
      this._lightPositions[this._tripId + 1] = this._inverseMatrixCache[5];
      this._lightPositions[this._tripId + 2] = this.props.z;

      this._lightVolumes[this._quadId]     = this._inverseMatrixCache[0];
      this._lightVolumes[this._quadId + 1] = this._inverseMatrixCache[1];
      this._lightVolumes[this._quadId + 2] = this._inverseMatrixCache[2];
      this._lightVolumes[this._quadId + 3] = this._inverseMatrixCache[3];
    }

    _scope._updateColor = function() {
      if (this._currentColorUpdateId < this.color.updateId) {
        this._currentColorUpdateId = this.color.updateId;

        this.colorCache[3] = this._parent.colorCache[3] * this.color.a;
        this.colorCache[0] = this._parent.colorCache[0] * this.color.r * this.colorCache[3];
        this.colorCache[1] = this._parent.colorCache[1] * this.color.g * this.colorCache[3];
        this.colorCache[2] = this._parent.colorCache[2] * this.color.b * this.colorCache[3];

        helpers.arraySet(this._lightColors,  this.colorCache,  this._quadId);
      }
    }
  }
);
