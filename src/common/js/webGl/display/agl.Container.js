require("./agl.Item.js");
require("../NameSpace.js");

AGL.Container = helpers.createPrototypeClass(
  AGL.Item,
  function Container() {
    AGL.Item.call(this);

    helpers.constant(this, "type", AGL.Container.TYPE);

    this.children = [];

    this.worldPropsUpdateId         =
    this.worldColorUpdateId         =
    this._currentWorldPropsUpdateId =
    this._currentWorldColorUpdateId = 0;

    this.colorCache = [1, 1, 1, 1];

  },
  function(_scope, _super) {
    helpers.get(_scope, "numChildren", function() { return this.children.length; });

    _scope.destruct = function() {
      this.empty();

      this.children   =
      this.colorCache = null;

      _super.destruct.call(this);
    }

    _scope.empty = function() {
      while (this.numChildren) this.removeChildAt(0);
    }

    _scope.contains = function(child) {
      return this.getChildIndex(child) > -1;
    }

    _scope.addChild = function(child) {
      return this.addChildAt(child, this.numChildren);
    }

    _scope.addChildAt = function(child, index) {
      if (child) {
        child.parent && child.parent.removeChild(child);
        this.children.push(child);
        this.setChildIndex(child, index);
        child.parent = this;
      }
      return child;
    }

    _scope.removeChild = function(child) {
      if (!child || !this.contains(child)) return null;
      helpers.removeFromArray(this.children, child);
      child.parent = null;
      return child;
    }

    _scope.removeChildAt = function(index) {
      return this.removeChild(this.getChildAt(index));
    }

    _scope.getChildAt = function(index) {
      return this.children[index];
    }

    _scope.setChildIndex = function(child, index) {
      if (!child || index < 0) return null;
      helpers.removeFromArray(this.children, child);
      this.children.splice(index, 0, child);
      return child;
    }

    _scope.getChildIndex = function(child) {
      return this.children.indexOf(child);
    }

    _scope.swapChildren = function(childA, childB) {
      var childAIndex = this.getChildIndex(childA);
      var childBIndex = this.getChildIndex(childB);
      if (childAIndex < 0 || childBIndex < 0) return false;
      this.setChildIndex(childA, childBIndex);
      this.setChildIndex(childB, childAIndex);
      return true;
    }

    _scope.update = function(renderTime, parent) {
      this._updateProps(parent);
      this._updateColor(parent);
    }

    _scope._updateProps = function(parent) {
      var props = this.props;
      if (this._currentWorldPropsUpdateId < parent.worldPropsUpdateId || props.isUpdated()) {
        this._currentWorldPropsUpdateId = parent.worldPropsUpdateId;
        this.worldPropsUpdateId++;

        this._transformItem(props, parent);
      }
    }

    _scope._updateColor = function(parent) {
      var props = this.color;
      if (this._currentWorldColorUpdateId < parent.worldColorUpdateId || props.isUpdated()) {
        this._currentWorldColorUpdateId = parent.worldColorUpdateId;
        this.worldColorUpdateId++;

        var parentColor = parent.colorCache;

        this.colorCache[0] = parentColor[0] * props.r;
        this.colorCache[1] = parentColor[1] * props.g;
        this.colorCache[2] = parentColor[2] * props.b;
        this.colorCache[3] = parentColor[3] * props.a;
      }
    }
  }
);
helpers.constant(AGL.Container, "TYPE", "container");
