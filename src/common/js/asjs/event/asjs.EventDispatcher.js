createClass(ASJS, "EventDispatcher", BaseClass, function(_scope, _super) {
  var _handlers = {};

  _scope.dispatchEvent = function(event, data, bubble) {
    if (!_handlers || !event) return;
    var e = ASJS.EventDispatcher.createEvent(event, data, bubble);
    if (_scope.el) {
      _scope.el.dispatchEvent(e);
      return;
    }

    if (!_scope.hasEventListener(e.type)) return;

    map(cloneArray(_handlers[e.type]), function(handlerIndex, handlerItem) {
      handlerItem(e);
    });
  }

  _scope.addEventListener = function(type, handler, options) {
    var types = parseTypes(type);
    map(types, function(typeIndex, typeItem) {
      if (typeItem !== "" && !_scope.hasEventListener(typeItem, handler)) {
        if (!_handlers[typeItem]) _handlers[typeItem] = [];
        _handlers[typeItem].push(handler);
        _scope.el && _scope.el.addEventListener(typeItem, handler, options);
      }
    });
  }

  _scope.removeEventListeners = function() {
    map(_handlers, function(handlerIndex, handlerItem) {
      _scope.removeEventListener(handlerIndex);
    });
    _handlers = {};
  }

  _scope.removeEventListener = function(type, handler) {
    var types = parseTypes(type);
    map(types, function(typeIndex, typeItem) {
      if (typeItem !== "" && _scope.hasEventListener(typeItem, handler)) {
        var handlers = _handlers[typeItem];
        var i = handlers.length;
        while (i--) {
          var handlerItem = handlers[i];
          if (!handler || handlerItem === handler) {
            removeFromArray(_handlers[typeItem], handlerItem);
            _scope.el && _scope.el.removeEventListener(typeItem, handlerItem, true);
          }
        }
        _handlers[typeItem].length === 0 && del(_handlers, typeItem);
      }
    });
  }

  _scope.hasEventListener = function(type, handler) {
    var types = parseTypes(type);
    var i = types.length;
    while (i--) {
      var t = types[i];
      if (
        t !== "" &&
        _handlers[t] &&
        _handlers[t].length > 0 &&
        (!handler || inArray(_handlers[t], handler))
      ) return true;
    }
    return false;
  };

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _scope.removeEventListeners && _scope.removeEventListeners();

    _handlers = null;

    _super.destruct();
  }

  function parseTypes(type) {
    var types;
    if (tis(type, "object")) {
      types = [];
      map(type, function(id, item) {
        types = types.concat(item.split(" "));
      });
    } else {
      types = type.split(" ");
    }

    return types;
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
