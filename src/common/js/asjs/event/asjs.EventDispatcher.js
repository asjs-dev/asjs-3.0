require("../core/asjs.Polyfill.js");

createClass(ASJS, "EventDispatcher", ASJS.BaseClass, function(_scope, _super) {
  var _polyfill = ASJS.Polyfill.instance;

  var _handlers = {};

  _scope.dispatchEvent = function(event, data, bubble) {
    if (!_handlers || !event) return;
    if (_scope.el) {
      _scope.el.dispatchEvent(ASJS.EventDispatcher.createEvent(event, data, bubble));
      return;
    }

    var e = ASJS.EventDispatcher.createEvent(event, data, bubble);
    if (!_scope.hasEventListener(e.type)) return;
    var handlers = _handlers[e.type];
    var i = -1;
    var l = handlers.length;
    while (++i < l) handlers[i](e);
  }

  _scope.addEventListener = function(type, handler) {
    if (!_handlers) return;
    var types = tis(type, "object") ? type : type.split(" ");
    var i = -1;
    var l = types.length;
    while (++i < types.length) {
      var t = types[i];
      if (t !== "") {
        if (_scope.hasEventListener(t, handler)) return;
        if (!_handlers[t]) _handlers[t] = [];
        _handlers[t].push(handler);
        _scope.el && _scope.el.addEventListener(t, handler, true);
      }
    }
  }

  _scope.removeEventListeners = function() {
    if (!_handlers) return;
    for (var type in _handlers) _scope.removeEventListener(type);
    _handlers = {};
  }

  _scope.removeEventListener = function(type, handler) {
    if (!_handlers) return;
    var handlers = _handlers[type];
    if (!handlers) return;
    var removableHandlers = handler ? [handler] : handlers;
    while (removableHandlers.length > 0) {
      var h = removableHandlers.shift();
      handlers.remove(h);
      _scope.el && _scope.el.removeEventListener(type, h, true);
    }
    _handlers[type].length === 0 && del(_handlers, type);
  };

  _scope.hasEventListener = function(type, handler) {
    if (!_handlers) return;
    var handlers = _handlers[type];
    if (!handlers) return false;
    if (!handler)  return true;
    return handlers.indexOf(handler) > -1;
  };

  _scope.destruct = function() {
    _scope.removeEventListeners && _scope.removeEventListeners();

    _polyfill = null;
    _handlers = null;

    _super.destruct();
  }
});
rof(ASJS.EventDispatcher, "createEvent", function(event, data, bubble) {
  return !tis(event, "string")
    ? event
    : new CustomEvent(event, {
        detail     : data,
        cancelable : true,
        bubbles    : empty(bubble) ? true : bubble
    });
});
