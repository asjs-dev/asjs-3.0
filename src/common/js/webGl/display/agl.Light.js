import { arraySet } from "../agl.Helpers.js";
import "../NameSpace.js";
import "../data/props/agl.LightProps.js";
import "./agl.BaseDrawable.js";

AGL.Light = class extends AGL.BaseDrawable {
  constructor(id, lightData, extensionData) {
    super();

    this.props = new AGL.LightProps();

    this.color.a = 0;

    this._id = id;
    this._matId = id * 16;
    this._colId = this._matId + 8;
    this._datId = this._matId + 12;
    this._extId = id * 4;

    this._lightData = lightData;
    this._extensionData = extensionData;

    this._castShadow =
    this._gouraud =
    this.castShadow =
    this.gouraud = true;

    this.angle = 0;
    this.spotAngle = 180 * AGL.Utils.THETA;
    this.type = AGL.Light.Type.SPOT;
    this.precision =
    this.diffuse = 1;
  }

  get type() { return this._extensionData[this._extId]; }
  set type(v) { this._extensionData[this._extId] = v; }

  get castShadow() { return this._castShadow; }
  set castShadow(v) {
    this._castShadow = v;
    this._updateShadowProps();
  }

  get gouraud() { return this._gouraud; }
  set gouraud(v) {
    this._gouraud = v;
    this._updateShadowProps();
  }

  get precision() { return this._extensionData[this._extId + 3]; }
  set precision(v) { this._extensionData[this._extId + 3] = Math.max(1, v); }

  get angle() { return this._lightData[this._datId + 3]; }
  set angle(v) { this._lightData[this._datId + 3] = v; }

  get spotAngle() { return this._lightData[this._matId + 7]; }
  set spotAngle(v) { this._lightData[this._matId + 7] = v; }

  isOn() {
    return this.renderable && this.stage !== null;
  }

  update() {
    const lightData = this._lightData;
    const datId = this._datId;

    if (this.isOn()) {
      this._updateProps();
      this._updateColor();

      lightData[datId] = lightData[datId - 1] > 0
        ? 1
        : 0;
      lightData[datId + 1] = this.diffuse;
      lightData[datId + 2] = this.props.alpha;

      lightData[this._matId + 6] = this.props.width;

      this._extensionData[this._extId + 2] = this.props.z;
    } else
      lightData[datId] = 0;
  }

  _updateShadowProps() {
    this._extensionData[this._extId + 1] =
      this._castShadow * 1 |
      this._gouraud * 2;
  }

  _updateAdditionalData() {
    if (
      this.isOn() &&
      this._currentAdditionalPropsUpdateId < this.propsUpdateId
    ) {
      this._currentAdditionalPropsUpdateId = this.propsUpdateId;
      this._calcBounds();
    }
  }

  _calcCorners() {
    AGL.Matrix3.calcCorners(
      this.matrixCache,
      this._corners,
      this.stage.renderer
    );

    const corners = this._corners;

    const a = corners[0];
    const b = corners[1];
    const c = corners[2];
    const d = corners[3];

    a.x += (a.x - d.x) + (a.x - c.x);
    a.y += (a.y - d.y) + (a.y - c.y);
    c.x += (c.x - b.x);
    c.y += (c.y - b.y);
    d.x += (d.x - b.x);
    d.y += (d.y - b.y);
  }

  _updateTransform(props, parent) {
    super._updateTransform(props, parent);

    arraySet(this._lightData, this.matrixCache, this._matId);
  }

  _updateColor() {
    const color = this.color;

    if (this._currentColorUpdateId < color.updateId) {
      this._currentColorUpdateId = color.updateId;

      const lightData = this._lightData;
      const parentColorCache = this._parent.colorCache;

      const colId = this._colId;

      lightData[colId] = parentColorCache[0] * color.r;
      lightData[colId + 1] = parentColorCache[1] * color.g;
      lightData[colId + 2] = parentColorCache[2] * color.b;
      lightData[colId + 3] = parentColorCache[3] * color.a;
    }
  }
}

AGL.Light.Type = {
  SPOT : 0,
  AMBIENT : 1
};
