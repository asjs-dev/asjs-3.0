require("./webGl.Item.js");
require("../NameSpace.js");

createClass(WebGl, "Container", WebGl.Item, function(_scope, _super) {
  var _children      = [];
  var _mouseChildren = true;

  var _parentColor;

  prop(_scope, "mouseChildren", {
    get: function() { return _mouseChildren; },
    set: function(v) {
      _mouseChildren = v;
      var i = _scope.numChildren;
      while (i--) _scope.getChildAt(i).enabled = _mouseChildren;
    }
  });

  get(_scope, "numChildren", function() { return _children.length; });

  _scope.clear = function() {
    while (_scope.numChildren) _scope.removeChildAt(0);
  }

  _scope.contains = function(child) {
    return _scope.getChildIndex(child) > -1;
  }

  _scope.addChild = function(child) {
    return _scope.addChildAt(child, _scope.numChildren);
  }

  _scope.addChildAt = function(child, index) {
    if (!child) return null;
    if (child.parent) child.parent.removeChild(child);
    child.enabled = child.enabled ? _mouseChildren : child.enabled;
    _children.push(child);
    _scope.setChildIndex(child, index);
    child.parent = _scope;
    if (is(child, WebGl.Container)) child.setParentColor(_scope.colorCache);
    child.parentMatrix = _scope.matrixCache;
    return child;
  }

  _scope.removeChild = function(child) {
    if (!child || !_scope.contains(child)) return null;
    _children.remove(child);
    if (is(child, WebGl.Container)) child.setParentColor(null);
    child.parentMatrix = null;
    child.parent = null;
    return child;
  }

  _scope.removeChildAt = function(index) {
    return _scope.removeChild(_scope.getChildAt(index));
  }

  _scope.getChildAt = function(index) {
    return _children[index];
  }

  _scope.setChildIndex = function(child, index) {
    if (!child || index < 0) return null;
    _children.remove(child);
    _children.splice(index, 0, child);
    return child;
  }

  _scope.getChildIndex = function(child) {
    return _children.indexOf(child);
  }

  _scope.swapChildren = function(childA, childB) {
    var childAIndex = _scope.getChildIndex(childA);
    var childBIndex = _scope.getChildIndex(childB);
    if (childAIndex === -1 || childBIndex === -1) return false;
    _scope.setChildIndex(childA, childBIndex);
    _scope.setChildIndex(childB, childAIndex);
    return true;
  }

  _scope.setParentColor = function(v) {
    _parentColor = v;
  }

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    if (_parent && _parent.removeChild) _parent.removeChild(_scope);

    _children      =
    _mouseChildren =
    _parentColor   =
    _parent        = null;

    _super.destruct();
  }

  _scope.updateColorCache = function() {
    var color = _scope.color;

    _scope.colorCache[0] = _parentColor[0] * color.r;
    _scope.colorCache[1] = _parentColor[1] * color.g;
    _scope.colorCache[2] = _parentColor[2] * color.b;
    _scope.colorCache[3] = _parentColor[3] * color.a;
  }
});
