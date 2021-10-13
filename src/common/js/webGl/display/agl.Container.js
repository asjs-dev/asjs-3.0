require("./agl.Item.js");
require("../NameSpace.js");

AGL.Container = helpers.createPrototypeClass(
  AGL.Item,
  function Container() {
    AGL.Item.call(this);

    this.TYPE = AGL.Container.TYPE;

    this.premultipliedAlpha = 1;

    this.children = [];
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
      if (child) {
        helpers.removeFromArray(this.children, child);
        child.parent = null;
      }
      return child;
    }

    _scope.removeChildAt = function(index) {
      return this.removeChild(this.getChildAt(index));
    }

    _scope.getChildAt = function(index) {
      return this.children[index];
    }

    _scope.setChildIndex = function(child, index) {
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

      bounds.x      =
      bounds.y      =  1/0;
      bounds.width  =
      bounds.height = -1/0;

      for (var i = 0, l = this.children.length; i < l; ++i) {
        var childBounds = this.children[i].getBounds();

        bounds.x      = min(bounds.x,      childBounds.x);
        bounds.y      = min(bounds.y,      childBounds.y);
        bounds.width  = max(bounds.width,  childBounds.width);
        bounds.height = max(bounds.height, childBounds.height);
      }

      return bounds;
    }

    _scope.update = function() {
      this._updateProps();
      this._updateColor();
    }

    _scope._updatePremultipliedAlpha = function() {
      this.premultipliedAlpha = this.props.alpha * this.parent.premultipliedAlpha;
    }

    _scope._updateColor = function() {
      var parent = this._parent;
      var color  = this.color;

      this._updatePremultipliedAlpha();

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
