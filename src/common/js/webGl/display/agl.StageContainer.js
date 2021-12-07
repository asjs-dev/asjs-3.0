import "../NameSpace.js";
import "./agl.Container.js";
import "./agl.BaseItem.js";

AGL.StageContainer = class extends AGL.Container {
  constructor(renderer) {
    super();

    this.renderer = renderer;
    this._parent = new AGL.BaseItem();
  }

  get stage() { return this; }

  get parent() { return this._parent; }

  get premultipliedAlpha() { return this.props.alpha; }
}
