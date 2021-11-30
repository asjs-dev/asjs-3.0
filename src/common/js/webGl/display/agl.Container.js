import "../NameSpace.js";
import "./agl.Item.js";

AGL.Container = class extends AGL.Item {
  constructor() {
    super();

    this.TYPE = AGL.Container.TYPE;

    this.premultipliedAlpha = 1;

    this.children = [];
  }

  destruct() {
    this.empty();

    super.destruct();
  }

  empty() {
    while (this.children.length) this.removeChildAt(0);
  }

  contains(child) {
    return this.getChildIndex(child) > -1;
  }

  addChild(child) {
    return this.addChildAt(child, this.children.length);
  }

  addChildAt(child, index) {
    if (child) {
      child.parent && child.parent.removeChild(child);
      this.children.push(child);
      this.setChildIndex(child, index);
      child.parent = this;
    }
    return child;
  }

  removeChild(child) {
    if (child) {
      helpers.removeFromArray(this.children, child);
      child.parent = null;
    }
    return child;
  }

  removeChildAt(index) {
    return this.removeChild(this.getChildAt(index));
  }

  getChildAt(index) {
    return this.children[index];
  }

  setChildIndex(child, index) {
    helpers.removeFromArray(this.children, child);
    this.children.splice(index, 0, child);
    return child;
  }

  getChildIndex(child) {
    return this.children.indexOf(child);
  }

  swapChildren(childA, childB) {
    const childAIndex = this.getChildIndex(childA);
    const childBIndex = this.getChildIndex(childB);
    if (childAIndex < 0 || childBIndex < 0) return false;
    this.setChildIndex(childA, childBIndex);
    this.setChildIndex(childB, childAIndex);
    return true;
  }

  getBounds() {
    const bounds = this._bounds;

    bounds.x      =
    bounds.y      =  1/0;
    bounds.width  =
    bounds.height = -1/0;

    for (let i = 0, l = this.children.length; i < l; ++i) {
      const childBounds = this.children[i].getBounds();

      bounds.x      = min(bounds.x,      childBounds.x);
      bounds.y      = min(bounds.y,      childBounds.y);
      bounds.width  = max(bounds.width,  childBounds.width);
      bounds.height = max(bounds.height, childBounds.height);
    }

    return bounds;
  }

  update() {
    this._updateProps();
    this._updateColor();
  }

  _updatePremultipliedAlpha() {
    this.premultipliedAlpha = this.props.alpha * this.parent.premultipliedAlpha;
  }

  _updateColor() {
    const parent = this._parent;
    const color  = this.color;

    this._updatePremultipliedAlpha();

    if (
      this._currentParentColorUpdateId < parent.colorUpdateId ||
      this._currentColorUpdateId < color.updateId
    ) {
      this._currentColorUpdateId       = color.updateId;
      this._currentParentColorUpdateId = parent.colorUpdateId;
      ++this.colorUpdateId;

      const colorCache       = this.colorCache;
      const parentColorCache = parent.colorCache;

      colorCache[0] = parentColorCache[0] * color.r;
      colorCache[1] = parentColorCache[1] * color.g;
      colorCache[2] = parentColorCache[2] * color.b;
      colorCache[3] = parentColorCache[3] * color.a;
    }
  }
}
AGL.Container.TYPE = "container";
