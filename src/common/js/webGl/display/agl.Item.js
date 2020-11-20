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

    this._currentPropsUpdateId      =
    this._currentColorUpdateId      =
    this._currentWorldPropsUpdateId =
    this._currentWorldColorUpdateId =
    this._matrixUpdateId            =
    this._currentMatrixUpdateId     = 0;

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
          this._currentWorldPropsUpdateId =
          this._currentWorldColorUpdateId = 0;
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

    _scope.update = function(renderTime, parent) {
      this._updateProps(parent);
    }

    _scope._updateProps = function(parent) {
      var props = this.props;
      if (parent && this._currentWorldPropsUpdateId < parent.worldPropsUpdateId || this._currentPropsUpdateId < props.updateId) {
        this._currentPropsUpdateId = props.updateId;
        this._currentWorldPropsUpdateId = parent.worldPropsUpdateId;
        ++this._matrixUpdateId;

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

        return true;
      }

      return false;
    }
  }
);
AGL.Item.TYPE = "item";
