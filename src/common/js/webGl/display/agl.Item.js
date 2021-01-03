require("../NameSpace.js");
require("../data/props/agl.ItemProps.js");
require("../data/props/agl.ColorProps.js");
require("../geom/agl.Rect.js");
require("./agl.BaseItem.js");

AGL.Item = helpers.createPrototypeClass(
  AGL.BaseItem,
  function Item() {
    AGL.BaseItem.call(this);

    this.TYPE = AGL.Item.TYPE;

    this.renderable = true;

    this.props = new AGL.ItemProps();
    this.color = new AGL.ColorProps();

    this._currentPropsUpdateId           =
    this._currentColorUpdateId           =
    this._currentParentPropsUpdateId     =
    this._currentParentColorUpdateId     =
    this._currentAdditionalPropsUpdateId = 0;

    this._callback = helpers.emptyFunction;

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

    helpers.property(_scope, "callback", {
      get: function() { return this._callback; },
      set: function(v) {
        if (this._callback !== v) this._callback = v || helpers.emptyFunction;
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
      this._updateProps(renderTime);
    }

    _scope._updateProps = function(renderTime) {
      var props  = this.props;
          props.updateRotation();
          props.updateScale();
      var parent = this._parent;

      if (
        this._currentParentPropsUpdateId < parent.propsUpdateId ||
        this._currentPropsUpdateId < props.updateId
      ) this._updateTransform(props, parent);
    }

    _scope._updateTransform = function(props, parent) {
      this._currentParentPropsUpdateId = parent.propsUpdateId;
      this._currentPropsUpdateId       = props.updateId;
      ++this.propsUpdateId;

      AGL.Matrix3.transform(
        parent.matrixCache,
        props,
        this.matrixCache
      );
    }
  }
);
AGL.Item.TYPE = "item";
