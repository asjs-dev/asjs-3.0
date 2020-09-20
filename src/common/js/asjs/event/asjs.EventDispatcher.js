helpers.createClass(ASJS, "EventDispatcher", helpers.BaseClass, function(_scope, _super) {
  var _handlers = {};

  _scope.dispatchEvent = function(event, data, bubble) {
    if (!_handlers || !event) return;
    var e = ASJS.EventDispatcher.createEvent(event, data, bubble);
    if (_scope.el) {
      _scope.el.dispatchEvent(e);
      return;
    }

    if (!_scope.hasEventListener(e.type)) return;

    helpers.map(helpers.cloneArray(_handlers[e.type]), function(handlerIndex, handlerItem) {
      handlerItem(e);
    });
  }

  _scope.addEventListener = function(type, handler, options) {
    var types = parseTypes(type);
    helpers.map(types, function(typeIndex, typeItem) {
      if (typeItem !== "" && !_scope.hasEventListener(typeItem, handler)) {
        if (!_handlers[typeItem]) _handlers[typeItem] = [];
        _handlers[typeItem].push(handler);
        _scope.el && _scope.el.addEventListener(typeItem, handler, options);
      }
    });
  }

  _scope.removeEventListeners = function() {
    helpers.map(_handlers, function(handlerIndex, handlerItem) {
      _scope.removeEventListener(handlerIndex);
    });
    _handlers = {};
  }

  _scope.removeEventListener = function(type, handler) {
    var types = parseTypes(type);
    helpers.map(types, function(typeIndex, typeItem) {
      if (typeItem !== "" && _scope.hasEventListener(typeItem, handler)) {
        var handlers = _handlers[typeItem];
        var i = handlers.length;
        while (i--) {
          var handlerItem = handlers[i];
          if (!handler || handlerItem === handler) {
            helpers.removeFromArray(_handlers[typeItem], handlerItem);
            _scope.el && _scope.el.removeEventListener(typeItem, handlerItem, true);
          }
        }
        _handlers[typeItem].length === 0 && helpers.deleteProperty(_handlers, typeItem);
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
        (!handler || helpers.inArray(_handlers[t], handler))
      ) return true;
    }
    return false;
  };

  helpers.override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _scope.removeEventListeners && _scope.removeEventListeners();

    _handlers = null;

    _super.destruct();
  }

  function parseTypes(type) {
    var types;
    if (helpers.typeIs(type, "object")) {
      types = [];
      helpers.map(type, function(id, item) {
        types = types.concat(item.split(" "));
      });
    } else {
      types = type.split(" ");
    }

    return types;
  }
});
helpers.constant(ASJS.EventDispatcher, "createEvent", function(event, data, bubble) {
  return !helpers.typeIs(event, "string")
    ? event
    : new CustomEvent(event, {
        detail     : data,
        cancelable : true,
        bubbles    : helpers.isEmpty(bubble) ? true : bubble
    });
});
