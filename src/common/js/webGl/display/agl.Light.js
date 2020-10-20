require("./agl.Item.js");
require("../NameSpace.js");

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
    this.color.a = 0;

    this.transition = 1;

    this._on = false;

    this._currentWorldPropsUpdateId = 0;

    this._id     = id;
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
      this._lightEffects   =
      this._lightPositions =
      this._lightVolumes   =
      this._lightColors    = null;

      _super.destruct.call(this);
    }

    _scope.update = function(renderTime, parent) {
      if (this.on) {
        var props = this.props;

        if (this._currentWorldPropsUpdateId < parent.worldPropsUpdateId || props.isUpdated()) {
          this._currentWorldPropsUpdateId = parent.worldPropsUpdateId;

          this._transformItem(props, parent);

          this._lightPositions[this._tripId]     = this.matrixCache[6];
          this._lightPositions[this._tripId + 1] = this.matrixCache[7];
          this._lightPositions[this._tripId + 2] = props.z;

          this._lightVolumes[this._duoId]     = this.matrixCache[0];
          this._lightVolumes[this._duoId + 1] = this.matrixCache[4];
        }

        this.color.isUpdated() && helpers.arraySet(this._lightColors,  this.colorCache,  this._quadId);

        this._lightEffects[this._id] = this.transition;
      } else this._lightColors[this._quadId + 3] = 0;
    }
  }
);
