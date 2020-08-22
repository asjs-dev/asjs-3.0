require("./agl.Item.js");
require("../NameSpace.js");
require("../data/props/agl.LightEffectProps.js");

AGL.Light = createPrototypeClass(
  AGL.Item,
  function Light() {
    AGL.Item.call(this);

    this._curWorldPropsId = -1;

    this.positionCache = [];
    this.volumeCache   = [];

    this.effect = new AGL.LightEffectProps();

    this.effectCache = this.effect.items;

    this.color.a = 0;
  },
  function() {
    this._updateProps = function(parent) {
      var props = this.props;

      if (this._curWorldPropsId !== parent.worldPropsUpdateId || props.isUpdated()) {
        this._curWorldPropsId = parent.worldPropsUpdateId;

        this._transformItem(props, parent);

        this.positionCache[0] = this.matrixCache[6];
        this.positionCache[1] = this.matrixCache[7];

        this.volumeCache[0] = 1 / Math.abs(this.matrixCache[0]);
        this.volumeCache[1] = 1 / Math.abs(this.matrixCache[4]);
      }
    }
  }
);
