require("../core/asjs.Polyfill.js");

ASJS.EventDispatcher = createClass(
"EventDispatcher",
ASJS.BaseClass,
function(_scope) {
  var _polyfill = ASJS.Polyfill.instance;

  var _handlers = {};

  _scope.dispatchEvent = function(event, data, bubble) {
    if (!event) return;
    if (_scope.el) {
      try {
        _polyfill.dispatchEvent(_scope.el, ASJS.EventDispatcher.createEvent(event, data, bubble));
      } catch (error) {
        trace(error);
      }
      return;
    }

    var e = ASJS.EventDispatcher.createEvent(event, data, bubble);
    if (!_scope.hasEventListener(e.type)) return;
    var handlers = _handlers[e.type];
    var i = -1;
    var l = handlers.length;
    while (++i < l) handlers[i](e);
  }

  _scope.addEventListener = function(type, handler, capture) {
    var types = tis(type, "object") ? type : type.split(" ");
    var i = -1;
    var l = types.length;
    while (++i < types.length) {
      var t = _scope.el ? _polyfill.convertEventType(types[i]) : types[i];
      if (t !== "") {
        if (_scope.hasEventListener(t, handler)) return;
        if (!_handlers[t]) _handlers[t] = [];
        _handlers[t].push(handler);
        if (_scope.el) _polyfill.addEventListener(_scope.el, t, handler, capture || false);
      }
    }
  }

  _scope.removeEventListeners = function() {
    if (_scope.el) {
      for (var type in _handlers) {
        var t = _polyfill.convertEventType(type);
        var handlers = _handlers[t];
        while (handlers && handlers.length > 0) _scope.removeEventListener(t, handlers[0]);
      }
      return;
    }

    _handlers = {};
  }

  _scope.removeEventListener = function(type, handler) {
    if (_scope.el) {
      var t = _polyfill.convertEventType(type);
      var handlers = _handlers[t];
      if (!handlers) return;
      if (handler) {
        var index = handlers.indexOf(handler);
        if (index === -1) return;
        handlers.splice(index, 1);
        _polyfill.removeEventListener(_scope.el, t, handler);
      } else {
        while (handlers.length > 0) _scope.removeEventListener(t, handlers[0]);
      }
      if (handlers.length === 0) del(_handlers, t);
      return;
    }

    if (!_scope.hasEventListener(type, handler)) return;
    _handlers[type].slice(_handlers[type].indexOf(handler), 1);
  };

  _scope.hasEventListener = function(type, handler) {
    var t = _scope.el ? _polyfill.convertEventType(type) : type;
    var handlers = _handlers[t];
    if (!handlers) return false;
    if (!handler)  return true;
    return handlers.indexOf(handler) > -1;
  };
});
rof(ASJS.EventDispatcher, "createEvent", function(event, data, bubble) {
  return !tis(event, "string")
    ? event
    : new CustomEvent(ASJS.Polyfill.instance.convertEventType(event), {
        detail: data,
        cancelable: true,
        bubbles: empty(bubble) ? true : bubble
    });
});
