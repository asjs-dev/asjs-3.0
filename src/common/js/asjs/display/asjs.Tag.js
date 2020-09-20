require("../event/asjs.EventDispatcher.js");
require("../geom/asjs.Rectangle.js");
require("../utils/asjs.CSS.js");

helpers.createClass(ASJS, "Tag", ASJS.EventDispatcher, function(_scope, _super) {
  var priv = {};

  helpers.constant(priv, "CREATED", "created");

  var _el;
  var _parent = null;
  var _state  = priv.CREATED;

  var _bounds = ASJS.Rectangle.create();

  _scope.new = function(tag) {
    _el = !tag || helpers.typeIs(tag, "string") ? document.createElement(tag || "div") : tag;
    _scope.setData("asjs-id", "instance_" + (++ASJS.Tag.instanceId));
    if (_el.parentElement) _parent = new ASJS.Sprite(_el.parentElement);
  }

  helpers.property(_scope, "id", {
    get: function() { return _scope.getAttr("id"); },
    set: function(v) { _scope.setAttr("id", v); }
  });

  helpers.property(_scope, "enabled", {
    get: function() { return _scope.getAttr("disabled") != "disabled"; },
    set: function(v) {
      if (v) {
        _scope.removeAttr("disabled");
        _scope.removeCSS("pointer-events");
      } else {
        _scope.setAttr("disabled", "disabled");
        _scope.setCSS("pointer-events", "none");
      }
    }
  });

  helpers.property(_scope, "text", {
    get: function() { return _el.textContent || _el.innerText; },
    set: function(v) {
      _el.textContent = _el.innerText = v;
    }
  });

  helpers.property(_scope, "html", {
    get: function() { return _el.innerHTML; },
    set: function(v) { _el.innerHTML = v; }
  });

  helpers.get(_scope, "asjsId", function() { return _scope.getData("asjs-id"); });

  helpers.get(_scope, "el", function() { return _el; });

  helpers.get(_scope, "attributes", function() { return _el.attributes; });

  helpers.get(_scope, "bounds", function() { return _bounds; });

  helpers.property(_scope, "parent", {
    get: function() { return _parent; },
    set: function(v) {
      if (helpers.isEmpty(v) || v.getChildIndex(_scope) > -1) {
        _parent = v;
        _scope.sendParentChangeEvent();
      }
    }
  });

  helpers.get(_scope, "stage", function() { return _scope.parent ? _scope.parent.stage : null; });

  _scope.hasClass = function(v) {
    return helpers.inArray(_scope.getClassList(), v);
  }

  _scope.addClass = function(v) {
    var newClasses = parseClassNames(v);
    var classList  = _scope.getClassList();
    var newClass;
    while (newClass = newClasses.shift()) {
      !_scope.hasClass(newClass) && classList.push(newClass);
    }
    _el.className = classList.join(" ").trim();
  }

  _scope.removeClass = function(v) {
    var removeClasses = parseClassNames(v);
    var classList     = _scope.getClassList();
    var removeClass;
    while (removeClass = removeClasses.shift()) helpers.removeFromArray(classList, removeClass);
    _el.className = classList.join(" ").trim();
  }

  _scope.removeClassList = function() {
    _el.className = "";
  }

  _scope.getClassList = function() {
    return _el.className.split(" ");
  }

  _scope.getCSS = ASJS.CSS.getCSS.bind(_scope, _scope);

  _scope.setCSS = ASJS.CSS.setCSS.bind(_scope, _scope);

  _scope.removeCSS = ASJS.CSS.removeCSS.bind(_scope, _scope);

  _scope.getAttr = function(k) {
    return _el.getAttribute(k);
  }

  _scope.setAttr = function(k, v) {
    _el.setAttribute(k, v);
  }

  _scope.removeAttr = function(k) {
    _el.removeAttribute(k);
  }

  _scope.getData = function(k) {
    return _scope.getAttr("data-" + k);
  }

  _scope.setData = function(k, v) {
    _scope.setAttr("data-" + k, v);
  }

  _scope.removeData = function(k) {
    _scope.removeAttr("data-" + k);
  }

  _scope.clear = function() {
    _scope.html = "";
    _scope.text = "";
  }

  _scope.sendParentChangeEvent = function() {
    var state = _scope.stage ? ASJS.Stage.ADDED_TO_STAGE : ASJS.Stage.REMOVED_FROM_STAGE;
    (_state !== priv.CREATED || state !== ASJS.Stage.REMOVED_FROM_STAGE) && _scope.dispatchEvent(state, null, false);
    _state = state;
  }

  helpers.override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _parent && _parent.removeChild && _parent.removeChild(_scope);

    _scope.clear && _scope.clear();

    var attributeNames = [];
    for (var key in _scope.attributes) attributeNames.push(_scope.attributes[key].name);
    for (var key in attributeNames) _scope.removeAttr(attributeNames[key]);

    helpers.destructObject(_el);

    _bounds =
    _el     =
    _parent =
    _state  = null;

    _super.destruct();
  }

  function parseClassNames(classNames) {
    return helpers.typeIs(classNames, "object") ? classNames : classNames.split(" ");
  }
});
helpers.constant(ASJS.Tag, "cssProp", function(s, l, pn) {
  pn = pn || l;
  helpers.property(s, l, {
    get: s.getCSS.bind(s, pn),
    set: s.setCSS.bind(s, pn)
  });
});
helpers.constant(ASJS.Tag, "attrProp", function(s, l, pn) {
  pn = pn || l;
  helpers.property(s, l, {
    get: s.getAttr.bind(s, pn),
    set: s.setAttr.bind(s, pn)
  });
});
ASJS.Tag.instanceId = -1;
