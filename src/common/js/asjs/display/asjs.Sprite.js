require("./asjs.DisplayObject.js");
require("../geom/asjs.Rectangle.js");

ASJS.Sprite = createClass(
"Sprite",
ASJS.DisplayObject,
function(_scope, _super) {
  var _children      = [];
  var _mouseChildren = true;
  
  get(_scope, "bounds", function() {
    var rect = _super.bounds;
    var size = new ASJS.Rectangle();

    var i = -1;
    var l = _scope.numChildren;
    while (++i < l) {
      var child = _scope.getChildAt(i);
      var childRect = child.bounds;
      if (i === 0) {
        size.x = childRect.x;
        size.y = childRect.y;
        size.width = childRect.width + childRect.x;
        size.height = childRect.height + childRect.y;
      } else {
        if (childRect.x < size.x) size.x = childRect.x;
        if (childRect.y < size.y) size.y = childRect.y;
        if (childRect.width + childRect.x > size.width) size.width = childRect.width + childRect.x;
        if (childRect.height + childRect.y > size.height) size.height = childRect.height + childRect.y;
      }
    }

    rect.x += size.x;
    rect.y += size.y;
    if (size.width - size.x > rect.width) rect.width = size.width - size.x;
    if (size.height - size.y > rect.height) rect.height = size.height - size.y;

    return rect;
  });

  prop(_scope, "mouseChildren", {
    get: function() { return _mouseChildren; },
    set: function(v) {
      _mouseChildren = v;
      var i = -1;
      var l = _scope.numChildren;
      while (++i < l) _scope.getChildAt(i).enabled = _mouseChildren;
    }
  });

  get(_scope, "numChildren", function() { return _children.length; });

  _scope.clear = function() {
    while (_scope.numChildren > 0) _scope.removeChildAt(0);
    _super.clear();
  }

  _scope.contains = function(child) {
    return _scope.getChildIndex(child) > -1;
  }

  _scope.addChild = function(child) {
    return _scope.addChildAt(child, _scope.numChildren);
  }

  _scope.addChildAt = function(child, index) {
    if (!child) return null;
    _scope.el.appendChild(child.el);
    child.enabled = child.enabled ? _mouseChildren : child.enabled;
    _children.push(child);
    _scope.setChildIndex(child, index);
    child.parent = _scope;
    return child;
  }

  _scope.removeChild = function(child) {
    if (!child) return null;
    _scope.el.removeChild(child.el);
    var index = _scope.getChildIndex(child);
    if (index > -1) _children.splice(index, 1);
    child.parent = null;
    return child;
  }

  _scope.removeChildAt = function(index) {
    return _scope.removeChild(_scope.getChildAt(index));
  }

  _scope.getChildAt = function(index) {
    return index < 0 || index > _scope.numChildren - 1 ? null : _children[index];
  }

  _scope.setChildIndex = function(child, index) {
    if (!child || index < 0) return null;
    var childActualIndex = _scope.getChildIndex(child);
    if (childActualIndex > -1) _children.splice(childActualIndex, 1);
    var afterChild = _scope.getChildAt(index);
    if (afterChild) _scope.el.insertBefore(child.el, afterChild.el);
    _children.splice(index, 0, child);
    return child;
  }

  _scope.getChildIndex = function(child) {
    return !child ? -1 : _children.indexOf(child);
  }

  _scope.swapChildren = function(childA, childB) {
    var childAIndex = _scope.getChildIndex(childA);
    var childBIndex = _scope.getChildIndex(childB);
    if (childAIndex === -1 || childBIndex === -1) return false;
    _scope.setChildIndex(childA, childBIndex);
    _scope.setChildIndex(childB, childAIndex);
    return true;
  }

  _scope.getChildByDOMObject = function(domObject) {
    if (!domObject) return null;
    var i = -1;
    var l = _scope.numChildren;
    while (++i < l) {
      var child = _scope.getChildAt(i);
      if (domObject.id === child.id) return child;
      else if (child.numChildren) {
        var grandChild = child.getChildByDOMObject(domObject);
        if (grandChild) return grandChild;
      }
    }
    return null;
  }

  _scope.sendParentChangeEvent = function() {
    _super.sendParentChangeEvent();
    var i = -1;
    var l = _scope.numChildren;
    while (++i < l) _scope.getChildAt(i).sendParentChangeEvent();
  }
});
