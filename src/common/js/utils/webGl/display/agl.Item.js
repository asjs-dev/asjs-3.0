require("../NameSpace.js");
require("../data/props/agl.ItemProps.js");
require("../data/props/agl.ColorProps.js");

AGL.Item = createPrototypeClass(
  ASJS.BasePrototypeClass,
  function Item() {
    cnst(this, "type", AGL.Item.TYPE);

    this.renderable  = true;
    this.interactive = false;

    this.matrixCache = AGL.Matrix3.identity();

    this.props = new AGL.ItemProps();
    this.color = new AGL.ColorProps();

    this.colorCache = this.color.items;

    this.parent = null;
  },
  function(_super) {
    get(this, "stage", function() { return this.parent ? this.parent.stage : null; });

    this.destruct = function() {
      this.parent && this.parent.removeChild && this.parent.removeChild(this);

      _super.destruct.call(this);
    }

    this.update = function(renderTime, parent) {
      this._updateProps(parent);
    }

    this._updateProps = function(parent) {
      var props = this.props;
      props.isUpdated() && this._transformItem(props, parent);
    }

    this._transformItem = function(props, parent) {
      AGL.Matrix3.transform(
        parent.matrixCache,

        props.x,
        props.y,

        props.sr,
        props.cr,

        props.anchorX,
        props.anchorY,

        props.scaledWidth,
        props.scaledHeight,

        this.matrixCache
      );
    }
  }
);
cnst(AGL.Item, "TYPE", "item");
