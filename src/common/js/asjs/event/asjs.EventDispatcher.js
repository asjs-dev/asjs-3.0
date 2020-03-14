require("../core/asjs.Polyfill.js");

createClass(ASJS, "EventDispatcher", ASJS.BaseClass, function(_scope, _super) {
  var _polyfill = ASJS.Polyfill.instance;

  var _handlers = {};

  _scope.dispatchEvent = function(event, data, bubble) {
    if (!_handlers || !event) return;
    var e = ASJS.EventDispatcher.createEvent(event, data, bubble);
    if (_scope.el) {
      _scope.el.dispatchEvent(e);
      return;
    }

    if (!_scope.hasEventListener(e.type)) return;
    var handlers = _handlers[e.type];
    var i = -1;
    var l = handlers.length;
    while (++i < l) handlers[i](e);
  }

  _scope.addEventListener = function(type, handler) {
    if (!_handlers) return;
    var types = parseTypes(type);
    var i = -1;
    var l = types.length;
    var t;
    while (++i < l) {
      t = types[i];
      if (t !== "" && !_scope.hasEventListener(t, handler)) {
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
    var types = parseTypes(type);
    var i = types.length;
    while (i--) {
      var t = types[i];
      if (t !== "" && _scope.hasEventListener(t, handler)) {
        var handlers = _handlers[t];
        while (handlers.length) {
          var h = handlers.shift();
          _scope.el && _scope.el.removeEventListener(t, h, true);
        }
        _handlers[t].length === 0 && del(_handlers, t);
      }
    }
  };

  _scope.hasEventListener = function(type, handler) {
    if (!_handlers) return false;
    var types = parseTypes(type);
    var i = types.length;
    while (i--) {
      var t = types[i];
      if (
        t !== "" &&
        _handlers[t] &&
        _handlers[t].length > 0 &&
        (!handler || _handlers[t].indexOf(handler) > -1)
      ) return true;
    }
    return false;
  };

  _scope.destruct = function() {
    _scope.removeEventListeners && _scope.removeEventListeners();

    _polyfill =
    _handlers = null;

    _super.destruct();
  }

  function parseTypes(type) {
    return tis(type, "object") ? type : type.split(" ");
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
