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
      var bounds = this._bounds;

      bounds.x      =  1/0;
      bounds.y      =  1/0;
      bounds.width  = -1/0;
      bounds.height = -1/0;

      var i;
      var l = this.children.length;
      var childBounds;
      for (i = 0; i < l; ++i) {
        childBounds = this.children[i].getBounds();
        bounds.x      = Math.min(bounds.x,      childBounds.x);
        bounds.y      = Math.min(bounds.y,      childBounds.y);
        bounds.width  = Math.max(bounds.width,  childBounds.width);
        bounds.height = Math.max(bounds.height, childBounds.height);
      }

      return bounds;
    }

    _scope.update = function(renderTime) {
      this._updateProps();
      this._updateColor();
    }

    _scope._updateColor = function() {
      var parent = this._parent;
      var color  = this.color;

      if (
        this._currentParentColorUpdateId < parent.colorUpdateId ||
        this._currentColorUpdateId < color.updateId
      ) {
        this._currentColorUpdateId       = color.updateId;
        this._currentParentColorUpdateId = parent.colorUpdateId;
        ++this.colorUpdateId;

        var colorCache       = this.colorCache;
        var parentColorCache = parent.colorCache;

        colorCache[0] = parentColorCache[0] * color.r;
        colorCache[1] = parentColorCache[1] * color.g;
        colorCache[2] = parentColorCache[2] * color.b;
        colorCache[3] = parentColorCache[3] * color.a;
      }
    }
  }
);
AGL.Container.TYPE = "container";
