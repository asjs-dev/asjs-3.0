require("../NameSpace.js");
require("../data/props/agl.ItemProps.js");
require("../data/props/agl.ColorProps.js");
require("../geom/agl.Rect.js");

AGL.Item = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function Item() {
    helpers.BasePrototypeClass.call(this);

    this.TYPE = AGL.Item.TYPE;

    this.renderable = true;

    this.matrixCache = AGL.Matrix3.identity();

    this.props = new AGL.ItemProps();
    this.color = new AGL.ColorProps();

    this._currentPropsUpdateId           =
    this._currentColorUpdateId           =
    this._currentParentPropsUpdateId     =
    this._currentParentColorUpdateId     =
    this._currentAdditionalPropsUpdateId =
    this.propsUpdateId                   = 0;

    this.colorCache = this.color.items;

    this._parent = null;

    this._bounds = AGL.Rect.create();
  },
  function(_scope, _super) {
    helpers.get(_scope, "stage", function() { return this._parent ? this._parent.stage : null; });

    helpers.property(_scope, "parent", {
      get: function() { return this._parent; },
      set: function(v) {
        if (this._parent !== v) {
          this._parent = v;
          this._currentParentPropsUpdateId     =
          this._currentParentColorUpdateId     =
          this._currentAdditionalPropsUpdateId = 0;
        }
      }
    });

    _scope.getBounds = function() {
      return this._bounds;
    }

    _scope.destruct = function() {
      this._parent && this._parent.removeChild && this._parent.removeChild(this);
      _super.destruct.call(this);
    }

    _scope.update = function(renderTime) {
      this._updateProps();
    }

    _scope._updateProps = function() {
      if (
        this._currentParentPropsUpdateId < this._parent.propsUpdateId ||
        this._currentPropsUpdateId < this.props.updateId
      ) this._updateTransform();
    }

    _scope._updateTransform = function() {
      this._currentParentPropsUpdateId = this._parent.propsUpdateId;
      this._currentPropsUpdateId       = this.props.updateId;
      ++this.propsUpdateId;

      AGL.Matrix3.transform(
        this._parent.matrixCache,

        this.props.x,
        this.props.y,

        this.props.sinRotationA,
        this.props.cosRotationA,
        this.props.sinRotationB,
        this.props.cosRotationB,

        this.props.anchorX,
        this.props.anchorY,

        this.props.scaledWidth,
        this.props.scaledHeight,

        this.matrixCache
      );
    }
  }
);
AGL.Item.TYPE = "item";
