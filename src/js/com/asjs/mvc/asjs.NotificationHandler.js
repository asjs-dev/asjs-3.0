ASJS.NotificationHandler = createSingletonClass(
"NotificationHandler",
ASJS.BaseClass,
function(_scope) {
  var _handlers = {};

  _scope.add = function(type, callback) {
    if (!type || !callback) return;
    if (_handlers[type] && _handlers[type].indexOf(callback) > -1) return;
    if (!_handlers[type]) _handlers[type] = [];
    _handlers[type].push(callback);
  }

  _scope.remove = function(type, callback) {
    if (!type || !callback) return;
    if (_handlers[type]) {
      var index = _handlers[type].indexOf(callback);
      if (index > -1) _handlers[type].splice(index, 1);
    }
  }

  _scope.sendNotification = function(type, data) {
    var handlers = _handlers[type];
    if (!handlers) return;
    var i = -1;
    var l = handlers.length;
    while (++i < l) {
      if (handlers[i]) {
        handlers[i](data);
      } else {
        handlers.splice(i, 1);
        l--;
      }
    }
  }
});
