require("../NameSpace.js");
require("../data/props/webGl.ItemProps.js");
require("../data/props/webGl.ColorProps.js");

WebGl.Item = createPrototypeClass(
  ASJS.BasePrototypeClass,
  function() {
    cnst(this, "type", WebGl.Item.TYPE);

    this._matrixUtils = WebGl.Matrix3;
    this._transform = this._matrixUtils.transform;

    this.renderable  = true;
    this.interactive = false;

    this.matrixCache = this._matrixUtils.identity();

    this.props = new WebGl.ItemProps();
    this.color = new WebGl.ColorProps();

    this.colorCache = this.color.items;

    this.parent = null;
  },
  function(_super) {
    get(this, "stage", function() { return this.parent ? this.parent.stage : null; });

    this.destruct = function() {
      this.parent && this.parent.removeChild && this.parent.removeChild(this);

      this.props.destruct();
      this.color.destruct();

      _super.destruct();
    }

    this.update = function(renderTime, parent) {
      this._updateProps(parent);
    }

    this._updateProps = function(parent) {
      var props = this.props;
      props.isUpdated() && this._transformItem(props, parent);
    }

    this._transformItem = function(props, parent) {
      this._transform(
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
cnst(WebGl.Item, "TYPE", "item");
