require("./webGl.Item.js");
require("../NameSpace.js");

createClass(WebGl, "Container", WebGl.Item, function(_scope, _super) {
  var _prt = _super.protected;

  _scope.shouldUpdateProps =
  _scope.shouldUpdateColor = true;

  _scope.parentColor = null;

  var _children = [];

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
    if (is(child, WebGl.Container)) {
      child.parentColor  = _scope.colorCache;
    }
    child.parentMatrix = _scope.matrixCache;
    return child;
  }

  _scope.removeChild = function(child) {
    if (!child || !_scope.contains(child)) return null;
    _children.remove(child);
    if (is(child, WebGl.Container)) child.parentColor = null;
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

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _children                =
    _mouseChildren           =
    _parent                  =
    _scope.parentMatrix      =
    _scope.parentColor       =
    _scope.shouldUpdateProps =
    _scope.shouldUpdateColor = null;

    _super.destruct();
  }

  _scope.postRender = function() {
    _scope.shouldUpdateProps =
    _scope.shouldUpdateColor = false;
  }

  _scope.updateProps = function() {
    _prt.updateList.push(_prt.updateProps);
    _scope.shouldUpdateProps = true;
  }

  _scope.updateColor = function() {
    _prt.updateList.push(_prt.updateColor);
    _scope.shouldUpdateColor = true;
  }

  override(_scope, _super, "update");
  _scope.update = function(transformFunction) {
    _prt.parent.shouldUpdateColor && _scope.updateColor();
    _super.update(transformFunction);
  }

  _prt.updateColor = function() {
    var color       = _scope.color;
    var parentColor = _scope.parentColor;

    _scope.colorCache[0] = parentColor[0] * color.r;
    _scope.colorCache[1] = parentColor[1] * color.g;
    _scope.colorCache[2] = parentColor[2] * color.b;
    _scope.colorCache[3] = parentColor[3] * color.a;
  }
});
