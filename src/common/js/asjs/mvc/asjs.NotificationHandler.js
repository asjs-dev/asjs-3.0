createSingletonClass(ASJS, "NotificationHandler", ASJS.BaseClass, function(_scope) {
  var _handlers = {};

  _scope.add = function(type, callback) {
    if (!type || !callback) return;
    if (_handlers[type] && _handlers[type].has(callback)) return;
    if (!_handlers[type]) _handlers[type] = [];
    _handlers[type].push(callback);
  }

  _scope.remove = function(type, callback) {
    type && callback && _handlers[type] && _handlers[type].remove(callback);
  }

  _scope.sendNotification = function(type, data) {
    var handlers = _handlers[type];
    if (!handlers) return;
    map(handlers, function(handlerIndex, handlerItem) {
      handlerItem(data, type);
    });
  }
});
