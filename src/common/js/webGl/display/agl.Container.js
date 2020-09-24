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
  function(_super) {
    helpers.get(this, "numChildren", function() { return this.children.length; });

    this.destruct = function() {
      this.empty();

      this.children   =
      this.colorCache = null;

      _super.destruct.call(this);
    }

    this.empty = function() {
      while (this.numChildren) this.removeChildAt(0);
    }

    this.contains = function(child) {
      return this.getChildIndex(child) > -1;
    }

    this.addChild = function(child) {
      return this.addChildAt(child, this.numChildren);
    }

    this.addChildAt = function(child, index) {
      if (!child) return null;
      if (child.parent) child.parent.removeChild(child);
      this.children.push(child);
      this.setChildIndex(child, index);
      child.parent = this;
      return child;
    }

    this.removeChild = function(child) {
      if (!child || !this.contains(child)) return null;
      helpers.removeFromArray(this.children, child);
      child.parent = null;
      return child;
    }

    this.removeChildAt = function(index) {
      return this.removeChild(this.getChildAt(index));
    }

    this.getChildAt = function(index) {
      return this.children[index];
    }

    this.setChildIndex = function(child, index) {
      if (!child || index < 0) return null;
      helpers.removeFromArray(this.children, child);
      this.children.splice(index, 0, child);
      return child;
    }

    this.getChildIndex = function(child) {
      return this.children.indexOf(child);
    }

    this.swapChildren = function(childA, childB) {
      var childAIndex = this.getChildIndex(childA);
      var childBIndex = this.getChildIndex(childB);
      if (childAIndex === -1 || childBIndex === -1) return false;
      this.setChildIndex(childA, childBIndex);
      this.setChildIndex(childB, childAIndex);
      return true;
    }

    this.update = function(renderTime, parent) {
      this._updateProps(parent);
      this._updateColor(parent);
    }

    this._updateProps = function(parent) {
      var props = this.props;

      if (this._currentWorldPropsUpdateId < parent.worldPropsUpdateId || props.isUpdated()) {
        this._currentWorldPropsUpdateId = parent.worldPropsUpdateId;
        this.worldPropsUpdateId++;

        this._transformItem(props, parent);
      }
    }

    this._updateColor = function(parent) {
      var color = this.color;

      if (this._currentWorldColorUpdateId < parent.worldColorUpdateId || color.isUpdated()) {
        this._currentWorldColorUpdateId = parent.worldColorUpdateId;
        this.worldColorUpdateId++;

        var parentColor = parent.colorCache;

        this.colorCache[0] = parentColor[0] * color.r;
        this.colorCache[1] = parentColor[1] * color.g;
        this.colorCache[2] = parentColor[2] * color.b;
        this.colorCache[3] = parentColor[3] * color.a;
      }
    }
  }
);
helpers.constant(AGL.Container, "TYPE", "container");
