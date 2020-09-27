require("./agl.Item.js");
require("../NameSpace.js");
require("../data/props/agl.LightEffectProps.js");

AGL.Light = helpers.createPrototypeClass(
  AGL.Item,
  function Light(
    id,
    lightPositions,
    lightVolumes,
    lightColors,
    lightEffects
  ) {
    AGL.Item.call(this);

    this.effect = new AGL.LightEffectProps();

    this.effectCache = this.effect.items;

    this.color.a = 0;

    this._on = false;

    this._currentWorldPropsUpdateId = -1;

    this._duoId  = id * 2;
    this._tripId = id * 3;
    this._quadId = id * 4;
    this._hexId  = id * 6;

    this._lightPositions = lightPositions;
    this._lightVolumes   = lightVolumes;
    this._lightColors    = lightColors;
    this._lightEffects   = lightEffects;
  },
  function(_scope, _super) {
    helpers.property(_scope, "on", {
      get: function() { return this._on && this.stage; },
      set: function(v) { this._on = v; }
    });

    _scope.destruct = function() {
      this.effect            =
      this.effectCache       =
      this._lightPositions   =
      this._lightVolumes     =
      this._lightColors      =
      this._lightEffects     = null;

      _super.destruct.call(this);
    }

    _scope._updateProps = function(parent) {
      if (this.on) {
        var props = this.props;

        if (this._currentWorldPropsUpdateId < parent.worldPropsUpdateId || props.isUpdated()) {
          this._currentWorldPropsUpdateId = parent.worldPropsUpdateId;

          this._transformItem(props, parent);

          this._lightPositions[this._tripId]     = this.matrixCache[6];
          this._lightPositions[this._tripId + 1] = this.matrixCache[7];
          this._lightPositions[this._tripId + 2] = this.props.zIndex;

          this._lightVolumes[this._duoId]     = 1 / Math.abs(this.matrixCache[0]);
          this._lightVolumes[this._duoId + 1] = 1 / Math.abs(this.matrixCache[4]);
        }

        helpers.arraySet(this._lightColors, this.colorCache, this._quadId);
        helpers.arraySet(this._lightEffects, this.effectCache, this._hexId);
      } else this._lightColors[this._quadId + 3] = 0;
    }
  }
);
