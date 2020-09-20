helpers.createSingletonClass(ASJS, "Head", helpers.BaseClass, function(_scope) {
  var _children = [];
  var _el       = document.head;

  helpers.get(_scope, "el", function() { return _head; });

  helpers.get(_scope, "numChildren", function() { return _children.length; });

  _scope.addChild = function(child) {
    if (!child) return null;
    child.parent && child.parent.removeChild(child);
    _children.push(child);
    _el.appendChild(child.el);
    child.parent = _scope;
    return child;
  }

  _scope.removeChild = function(child) {
    if (!child) return null;
    _el.removeChild(child.el);
    helpers.removeFromArray(_children, child);
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
