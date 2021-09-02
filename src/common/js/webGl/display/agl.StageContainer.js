require("./agl.Container.js");
require("./agl.BaseItem.js");
require("../NameSpace.js");

AGL.StageContainer = helpers.createPrototypeClass(
  AGL.Container,
  function StageContainer(renderer) {
    AGL.Container.call(this);

    this.renderer = renderer;
    this._parent = new AGL.BaseItem();
  },
  function(_scope) {
    helpers.get(_scope, "stage",  function() { return this; });
    helpers.get(_scope, "parent", function() { return this._parent; });

    _scope._updatePremultipliedAlpha = function() {
      this.premultipliedAlpha = this.props.alpha;
    }
  }
);
