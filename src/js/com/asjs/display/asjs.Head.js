ASJS.Head = createSingletonClass(
"Head",
ASJS.BaseClass,
function(_scope) {
  var _children = [];
  var _el       = document.head;

  get(_scope, "el", function() { return _head; });

  get(_scope, "numChildren", function() { return _children.length; });

  _scope.addChild = function(child) {
    if (!child) return null;
    if (child.parent) child.parent.removeChild(child);
    _children.push(child);
    _el.append(child.el);
    child.parent = _scope;
    return child;
  }

  _scope.removeChild = function(child) {
    if (!child) return null;
    _el.removeChild(child.el);
    var index = _scope.getChildIndex(child);
    if (index > -1) _children.splice(index, 1);
    child.parent = null;
    return child;
  }

  _scope.contains = function(child) {
    return _scope.getChildIndex(child) > -1;
  }

  _scope.getChildIndex = function(child) {
    return !child ? -1 : _children.indexOf(child);
  }
});
