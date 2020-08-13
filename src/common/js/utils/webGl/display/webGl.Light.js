require("./webGl.Item.js");
require("../NameSpace.js");
require("../data/props/webGl.LightEffectProps.js");

WebGl.Light = createPrototypeClass(
  WebGl.Item,
  function Light() {
    WebGl.Item.call(this);

    this._currentWorldPropsUpdateId = -1;

    this.positionCache = [];
    this.volumeCache   = [];

    this.effect = new WebGl.LightEffectProps();

    this.effectCache = this.effect.items;

    this.color.a = 0;
  },
  function(_super) {
    this.destruct = function() {
      this.effect.destruct();

      _super.destruct();
    }

    this._updateProps = function(parent) {
      var props = this.props;

      if (this._currentWorldPropsUpdateId !== parent.worldPropsUpdateId || props.isUpdated()) {
        this._currentWorldPropsUpdateId = parent.worldPropsUpdateId;

        this._transformItem(props, parent);

        this.positionCache[0] = this.matrixCache[6];
        this.positionCache[1] = this.matrixCache[7];

        this.volumeCache[0] = 1 / Math.abs(this.matrixCache[0]);
        this.volumeCache[1] = 1 / Math.abs(this.matrixCache[4]);
      }
    }
  }
);
