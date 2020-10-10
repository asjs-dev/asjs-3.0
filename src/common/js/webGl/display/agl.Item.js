require("../NameSpace.js");
require("../data/props/agl.ItemProps.js");
require("../data/props/agl.ColorProps.js");

AGL.Item = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function Item() {
    helpers.BasePrototypeClass.call(this);

    helpers.constant(this, "type", AGL.Item.TYPE);

    this.renderable  = true;
    this.interactive = false;

    this.matrixCache = AGL.Matrix3.identity();

    this.props = new AGL.ItemProps();
    this.color = new AGL.ColorProps();

    this.colorCache = this.color.items;

    this.parent = null;
  },
  function(_scope, _super) {
    helpers.get(_scope, "stage", function() { return this.parent ? this.parent.stage : null; });

    _scope.destruct = function() {
      this.parent && this.parent.removeChild && this.parent.removeChild(this);

      this.matrixCache =
      this.props       =
      this.color       =
      this.colorCache  = null;

      _super.destruct.call(this);
    }

    _scope.update = function(renderTime, parent) {
      var props = this.props;
      props.isUpdated() && this._transformItem(props, parent);
    }

    _scope._transformItem = function(props, parent) {
      AGL.Matrix3.transform(
        parent.matrixCache,

        props.x,
        props.y,

        props.sinRotation,
        props.cosRotation,

        props.anchorX,
        props.anchorY,

        props.scaledWidth,
        props.scaledHeight,

        this.matrixCache
      );
    }
  }
);
helpers.constant(AGL.Item, "TYPE", "item");
