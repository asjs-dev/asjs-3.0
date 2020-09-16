require("./agl.Item.js");
require("../NameSpace.js");
require("../data/props/agl.LightEffectProps.js");

AGL.Light = createPrototypeClass(
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

    this._on = false;

    this._curWorldPropsId = -1;

    this._id     = id;
    this._duoId  = id * 2;
    this._quadId = id * 4;

    this._lightPositions = lightPositions;
    this._lightVolumes   = lightVolumes;
    this._lightColors    = lightColors;
    this._lightEffects   = lightEffects;
    this._lightZIndices  = lightZIndices;

    this.effect = new AGL.LightEffectProps();

    this.effectCache = this.effect.items;

    this.color.a = 0;
  },
  function() {
    prop(this, "on", {
      get: function() { return this._on && this.stage; },
      set: function(v) { this._on = v; }
    });

    this._updateProps = function(parent) {
      var props = this.props;

      if (this._curWorldPropsId < parent.worldPropsUpdateId || props.isUpdated()) {
        if (this.on) {
          this._curWorldPropsId = parent.worldPropsUpdateId;

          this._transformItem(props, parent);

          this._lightPositions[this._duoId]     = this.matrixCache[6];
          this._lightPositions[this._duoId + 1] = this.matrixCache[7];
          this._lightVolumes[this._duoId]       = 1 / Math.abs(this.matrixCache[0]);
          this._lightVolumes[this._duoId + 1]   = 1 / Math.abs(this.matrixCache[4]);
          this._lightZIndices[this._id]         = this.props.zIndex;

          arraySet(this._lightColors,  this.colorCache,  this._quadId);
          arraySet(this._lightEffects, this.effectCache, this._quadId);
        } else this._lightColors[this._quadId + 3] = 0;
      }
    }
  }
);
