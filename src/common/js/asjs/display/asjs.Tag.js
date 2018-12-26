require("../event/asjs.EventDispatcher.js");
require("../geom/asjs.Rectangle.js");
require("../utils/asjs.CSS.js");

ASJS.Tag = createClass(
"Tag",
ASJS.EventDispatcher,
function(_scope, _super) {
  var priv = {};

  cnst(priv, "CREATED", "created");

  var _el;
  var _parent = null;
  var _state  = priv.CREATED;

  _scope.new = function(tag) {
    _el = !tag || tis(tag, "string") ? document.createElement(tag || "div") : tag;
  }

  prop(_scope, "text", {
    get: function() { return _el.textContent || _el.innerText; },
    set: function(v) {
      _el.textContent = v;
      _el.innerText = v;
    }
  });

  prop(_scope, "html", {
    get: function() { return _el.innerHTML; },
    set: function(v) { _el.innerHTML = v; }
  });

  get(_scope, "el", function() { return _el; });

  get(_scope, "bounds", function() { return new ASJS.Rectangle(); });

  prop(_scope, "parent", {
    get: function() { return _parent; },
    set: function(v) {
      if (empty(v) || v.getChildIndex(_scope) > -1) {
        _parent = v;
        _scope.sendParentChangeEvent();
      }
    }
  });

  get(_scope, "stage", function() { return _scope.parent ? _scope.parent.stage : null; });

  _scope.hasClass = function(v) {
    return _scope.getClassList().indexOf(v) > -1;
  }

  _scope.addClass = function(v) {
    var newClasses = v.split(" ");
    var classList  = _scope.getClassList();
    var newClass;
    while (newClass = newClasses.shift()) {
      if (!_scope.hasClass(newClass)) classList.push(newClass);
    }
    _el.className = classList.join(" ");
  }

  _scope.removeClass = function(v) {
    var removeClasses = v.split(" ");
    var classList     = _scope.getClassList();
    var removeClass;
    while (removeClass = removeClasses.shift()) {
      if (_scope.hasClass(removeClass)) classList.splice(classList.indexOf(removeClass), 1);
    }
    _el.className = classList.join(" ");
  }

  _scope.removeClassList = function() {
    _el.className = "";
  }

  _scope.getClassList = function() {
    return _el.className.split(" ");
  }

  _scope.getCSS = function(k) {
    return ASJS.CSS.getCSS(_scope, k);
  }

  _scope.setCSS = function(k, v) {
    ASJS.CSS.setCSS(_scope, k, v);
  }

  _scope.getAttr = function(k) {
    return _el.getAttribute( k );
  }

  _scope.setAttr = function( k, v ) {
    _el.setAttribute( k, v );
  }

  _scope.removeAttr = function( k ) {
    _el.removeAttribute( k );
  }

  _scope.clear = function() {
    _scope.html = "";
    _scope.text = "";
  }

  _scope.sendParentChangeEvent = function() {
    var state = _scope.stage ? ASJS.Stage.ADDED_TO_STAGE : ASJS.Stage.REMOVED_FROM_STAGE;
    if (_state !== priv.CREATED || state !== ASJS.Stage.REMOVED_FROM_STAGE) _scope.dispatchEvent(state, null, false);
    _state = state;
  }

  _scope.destruct = function() {
    _parent && _parent.removeChild && _parent.removeChild(_scope);

    _scope.clear && _scope.clear();

    _super.destruct();

    _el     = null;
    _parent = null;
    _state  = null;
  }
});
