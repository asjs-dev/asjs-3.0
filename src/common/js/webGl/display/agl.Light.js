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

    _scope._update = function(renderTime, parent) {
      var props = this.props;
      if (this._currentWorldPropsUpdateId < parent.worldPropsUpdateId || this._currentPropsUpdateId < props.updateId) {
        this._currentPropsUpdateId = props.updateId;
        this._currentWorldPropsUpdateId = parent.worldPropsUpdateId;

        this._transformItem(props, parent);

        this._lightPositions[this._tripId]     = this.matrixCache[6];
        this._lightPositions[this._tripId + 1] = this.matrixCache[7];
        this._lightPositions[this._tripId + 2] = props.z;

        this._lightVolumes[this._duoId]     = this.matrixCache[0];
        this._lightVolumes[this._duoId + 1] = this.matrixCache[4];
      }

      var colorProps = this.color;
      if (this._currentColorUpdateId < colorProps.updateId) {
        this._currentColorUpdateId = colorProps.updateId;

        this.colorCache[0] = this.color.r * this.color.a;
        this.colorCache[1] = this.color.g * this.color.a;
        this.colorCache[2] = this.color.b * this.color.a;
        this.colorCache[3] = this.color.a;

        helpers.arraySet(this._lightColors,  this.colorCache,  this._quadId);
      }

      this._lightEffects[this._id] = this.transition;
    }
  }
);
