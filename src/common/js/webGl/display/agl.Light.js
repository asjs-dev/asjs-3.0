require("./agl.AbstractDrawable.js");
require("../NameSpace.js");

AGL.Light = helpers.createPrototypeClass(
  AGL.AbstractDrawable,
  function Light(
    id,
    lightData,
    extensionData
  ) {
    AGL.AbstractDrawable.call(this);

    this.color.a = 0;

    this._id    = id;
    this._matId = id * 16;
    this._colId = this._matId + 8;
    this._datId = this._matId + 12;
    this._extId = id * 4;

    this._lightData     = lightData;
    this._extensionData = extensionData;

    this.angle      = 360 * Math.PI / 180;
    this.castShadow = true;
    this.type       = AGL.Light.Type.SPOT;
    this.precision  = 1;
    this.transition = 1;
  },
  function(_scope, _super) {
    helpers.property(_scope, "type", {
      get: function() { return this._extensionData[this._extId]; },
      set: function(v) { this._extensionData[this._extId] = v; }
    });

    helpers.property(_scope, "castShadow", {
      get: function() { return this._extensionData[this._extId + 1]; },
      set: function(v) { this._extensionData[this._extId + 1] = v; }
    });

    helpers.property(_scope, "precision", {
      get: function() { return this._extensionData[this._extId + 3]; },
      set: function(v) { this._extensionData[this._extId + 3] = Math.max(1, Math.min(10, v)); }
    });

    helpers.property(_scope, "transition", {
      get: function() { return this._lightData[this._datId + 1]; },
      set: function(v) { this._lightData[this._datId + 1] = Math.max(0, v); }
    });

    helpers.property(_scope, "angle", {
      get: function() { return this._lightData[this._datId + 3]; },
      set: function(v) { this._lightData[this._datId + 3] = v; }
    });

    _scope.isOn = function() {
      return this.renderable && this.stage !== null;
    }

    _scope._updateAdditionalData = function() {
      if (this.isOn() && this._currentAdditionalPropsUpdateId < this.propsUpdateId) {
        this._currentAdditionalPropsUpdateId = this.propsUpdateId;
        this._calcBounds();
      }
    }

    _scope._calcCorners = function() {
      AGL.Matrix3.calcCorners(this.matrixCache, this._corners, this.stage.renderer);

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

      var datId = this._datId;

      if (this.isOn()) {
        this._updateProps(renderTime);
        this._updateColor();

        lightData[datId]     = lightData[datId - 1] > 0 ? 1 : 0;
        lightData[datId + 2] = this.props.alpha;

        this._extensionData[this._extId + 2] = this.props.z;
      } else lightData[datId] = 0;
    }

    _scope._updateTransform = function(props, parent) {
      _super._updateTransform.call(this, props, parent);

      helpers.arraySet(this._lightData, this.matrixCache, this._matId);
    }

    _scope._updateColor = function() {
      var color = this.color;

      if (this._currentColorUpdateId < color.updateId) {
        this._currentColorUpdateId = color.updateId;

        var lightData        = this._lightData;
        var parentColorCache = this._parent.colorCache;

        var colId = this._colId;

        var premultipliedAlpha = parentColorCache[3] * color.a;

        lightData[colId]     = parentColorCache[0] * color.r * premultipliedAlpha;
        lightData[colId + 1] = parentColorCache[1] * color.g * premultipliedAlpha;
        lightData[colId + 2] = parentColorCache[2] * color.b * premultipliedAlpha;
        lightData[colId + 3] = premultipliedAlpha;
      }
    }
  }
);
AGL.Light.Type = helpers.deepFreeze({
  SPOT    : 0,
  AMBIENT : 1
});
