require("./agl.Item.js");
require("../NameSpace.js");

AGL.Container = helpers.createPrototypeClass(
  AGL.Item,
  function Container() {
    AGL.Item.call(this);

    this.TYPE = AGL.Container.TYPE;

    this.children = [];

    this.parentColorUpdateId = 0;

    this.colorCache = [1, 1, 1, 1];
  },
  function(_scope, _super) {
    _scope.destruct = function() {
      this.empty();

      _super.destruct.call(this);
    }

    _scope.empty = function() {
      while (this.children.length) this.removeChildAt(0);
    }

    _scope.contains = function(child) {
      return this.getChildIndex(child) > -1;
    }

    _scope.addChild = function(child) {
      return this.addChildAt(child, this.children.length);
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

    _scope.getBounds = function() {
      this._bounds.x      =  1/0;
      this._bounds.y      =  1/0;
      this._bounds.width  = -1/0;
      this._bounds.height = -1/0;

      var i;
      var l = this.children.length;
      var childBounds;
      for (i = 0; i < l; ++i) {
        childBounds = this.children[i].getBounds();
        this._bounds.x      = Math.min(this._bounds.x,      childBounds.x);
        this._bounds.y      = Math.min(this._bounds.y,      childBounds.y);
        this._bounds.width  = Math.max(this._bounds.width,  childBounds.width);
        this._bounds.height = Math.max(this._bounds.height, childBounds.height);
      }

      return this._bounds;
    }

    _scope.update = function(renderTime) {
      this._updateProps();
      this._updateColor();
    }

    _scope._updateColor = function() {
      if (
        this._currentParentColorUpdateId < this._parent.colorUpdateId ||
        this._currentColorUpdateId < this.color.updateId
      ) {
        this._currentColorUpdateId       = this.color.updateId;
        this._currentParentColorUpdateId = this._parent.colorUpdateId;
        ++this.colorUpdateId;

        this.colorCache[0] = this._parent.colorCache[0] * this.color.r;
        this.colorCache[1] = this._parent.colorCache[1] * this.color.g;
        this.colorCache[2] = this._parent.colorCache[2] * this.color.b;
        this.colorCache[3] = this._parent.colorCache[3] * this.color.a;
      }
    }
  }
);
AGL.Container.TYPE = "container";
