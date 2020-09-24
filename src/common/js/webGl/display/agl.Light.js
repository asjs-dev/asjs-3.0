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
    lightEffects,
    lightZIndices
  ) {
    AGL.Item.call(this);

    this.effect = new AGL.LightEffectProps();

    this.effectCache = this.effect.items;

    this.color.a = 0;

    this._on = false;

    this._currentWorldPropsUpdateId = -1;

    this._id     = id;
    this._duoId  = id * 2;
    this._quadId = id * 4;

    this._lightPositions = lightPositions;
    this._lightVolumes   = lightVolumes;
    this._lightColors    = lightColors;
    this._lightEffects   = lightEffects;
    this._lightZIndices  = lightZIndices;
  },
  function(_super) {
    helpers.property(this, "on", {
      get: function() { return this._on && this.stage; },
      set: function(v) { this._on = v; }
    });

    this._updateProps = function(parent) {
      var props = this.props;

      if (this._currentWorldPropsUpdateId < parent.worldPropsUpdateId || props.isUpdated()) {
        if (this.on) {
          this._currentWorldPropsUpdateId = parent.worldPropsUpdateId;

          this._transformItem(props, parent);

          this._lightPositions[this._duoId]     = this.matrixCache[6];
          this._lightPositions[this._duoId + 1] = this.matrixCache[7];
          this._lightVolumes[this._duoId]       = 1 / Math.abs(this.matrixCache[0]);
          this._lightVolumes[this._duoId + 1]   = 1 / Math.abs(this.matrixCache[4]);
          this._lightZIndices[this._id]         = this.props.zIndex;

          helpers.arraySet(this._lightColors,  this.colorCache,  this._quadId);
          helpers.arraySet(this._lightEffects, this.effectCache, this._quadId);
        } else this._lightColors[this._quadId + 3] = 0;
      }
    }

    this.destruct = function() {
      this.effect          =
      this.effectCache     =
      this._lightPositions =
      this._lightVolumes   =
      this._lightColors    =
      this._lightEffects   =
      this._lightZIndices  = null;

      _super.destruct.call(this);
    }
  }
);
