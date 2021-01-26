require("./agl.AbstractDrawable.js");
require("../NameSpace.js");

AGL.Light = helpers.createPrototypeClass(
  AGL.AbstractDrawable,
  function Light(
    id,
    lightData
  ) {
    AGL.AbstractDrawable.call(this);

    this.angle      = 360 * Math.PI / 180;
    this.transition = 1;

    this.color.a = 0;
    
    this.on = false;

    this._matId = id * 16;
    this._extId = this._matId + 6;
    this._colId = this._matId + 8;
    this._datId = this._matId + 12;

    this.castShadow = true;

    this._lightData = lightData;

    this.type = AGL.Light.Type.SPOT;
  },
  function(_scope, _super) {
    helpers.property(_scope, "type", {
      get: function() { return this._type; },
      set: function(v) {
        if (this._type !== v) {
          this._type = v;
          this._lightData[this._extId + 1] = v;
        }
      }
    });

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

      var extId = this._extId;
      var datId = this._datId;

      if (this.on) {
        this._updateProps(renderTime);
        this._updateColor();

        lightData[datId]     = lightData[datId - 1] > 0 ? 1 : 0;
        lightData[datId + 1] = this.transition;
        lightData[datId + 2] = this.props.alpha;
        lightData[datId + 3] = this.angle;

        lightData[extId] = this.castShadow;
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
AGL.Light.Type = {
  SPOT    : 0,
  AMBIENT : 1
};
