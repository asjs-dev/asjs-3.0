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

    this.color.a                    =
    this._currentWorldPropsUpdateId = 0;

    this._id     = id;
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
      if (this.stage && this._currentMatrixUpdateId < this._matrixUpdateId) {
        this._currentMatrixUpdateId = this._matrixUpdateId;
        this._calcBounds();
      }
    }

    _scope._update = function(renderTime, parent) {
      this._updateProps(parent);
      this._updateColor(parent);
      this._lightEffects[this._duoId]     = this.transition;
      this._lightEffects[this._duoId + 1] = this.props.alpha;
    }

    _scope._updateProps = function(parent) {
      var props = this.props;
      if (_super._updateProps.call(this, parent)) {
        AGL.Matrix3.inverse(this.matrixCache, this._inverseMatrixCache);

        this._lightPositions[this._tripId]     = this._inverseMatrixCache[4];
        this._lightPositions[this._tripId + 1] = this._inverseMatrixCache[5];
        this._lightPositions[this._tripId + 2] = this.props.z;

        this._lightVolumes[this._quadId]     = this._inverseMatrixCache[0];
        this._lightVolumes[this._quadId + 1] = this._inverseMatrixCache[1];
        this._lightVolumes[this._quadId + 2] = this._inverseMatrixCache[2];
        this._lightVolumes[this._quadId + 3] = this._inverseMatrixCache[3];
      }
    }

    _scope._updateColor = function(parent) {
      var colorProps = this.color;
      if (parent && this._currentColorUpdateId < colorProps.updateId) {
        this._currentColorUpdateId = colorProps.updateId;

        var parentColor = parent.colorCache;

        this.colorCache[3] = parentColor[3] * colorProps.a;
        this.colorCache[0] = parentColor[0] * colorProps.r * this.colorCache[3];
        this.colorCache[1] = parentColor[1] * colorProps.g * this.colorCache[3];
        this.colorCache[2] = parentColor[2] * colorProps.b * this.colorCache[3];

        helpers.arraySet(this._lightColors,  this.colorCache,  this._quadId);
      }
    }
  }
);
