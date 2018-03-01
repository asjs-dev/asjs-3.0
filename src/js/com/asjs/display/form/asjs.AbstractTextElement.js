ASJS.import("com/asjs/display/form/asjs.FormElement.js");
ASJS.import("com/asjs/utils/asjs.Keyboard.js");
ASJS.import("com/asjs/event/asjs.Event.js");
ASJS.import("com/asjs/event/asjs.KeyboardEvent.js");

ASJS.AbstractTextElement = createClass(
"AbstractTextElement",
ASJS.FormElement,
function(_scope, _super) {
  var _protectedChars = [
    ASJS.Keyboard.LEFT_ARROW,
    ASJS.Keyboard.UP_ARROW,
    ASJS.Keyboard.RIGHT_ARROW,
    ASJS.Keyboard.DOWN_ARROW,
    ASJS.Keyboard.BACKSPACE,
    ASJS.Keyboard.TAB,
    ASJS.Keyboard.DELETE,
    ASJS.Keyboard.ENTER,
    ASJS.Keyboard.SHIFT,
    ASJS.Keyboard.CTRL,
    ASJS.Keyboard.END,
    ASJS.Keyboard.HOME,
    ASJS.Keyboard.CAPS_LOCK,
    ASJS.Keyboard.ESCAPE
  ];
  var _controlChars = [
    ASJS.Keyboard.A,
    ASJS.Keyboard.C,
    ASJS.Keyboard.V,
    ASJS.Keyboard.X,
    ASJS.Keyboard.NUMPAD_1,
    ASJS.Keyboard.NUMPAD_3,
    ASJS.Keyboard.F7,
    ASJS.Keyboard.F9
  ];
  var _restrict;
  
  _scope.new = function() {
    _super.new();
    _scope.addEventListener(ASJS.KeyboardEvent.KEY_UP, onKeyUp);
    _scope.addEventListener(ASJS.Event.CHANGE, onChange);
  }
  
  prop(_scope, "readonly", {
    get: function() { return _scope.getAttr("readonly"); },
    set: function(v) {
      if (v) _scope.setAttr("readonly", "readonly");
      else _scope.removeAttr("readonly");
    }
  });

  prop(_scope, "placeholder", {
    get: function() { return _scope.getAttr("placeholder"); },
    set: function(v) { _scope.setAttr("placeholder", v); }
  });

  prop(_scope, "val", {
    get: function() { return _scope.el.value; },
    set: function(v) { _scope.el.value = v; }
  });

  prop(_scope, "maxChar", {
    get: function() { return _scope.getAttr("maxLength"); },
    set: function(v) { _scope.setAttr("maxLength", v); }
  });

  prop(_scope, "restrict", {
    get: function() { return _restrict; },
    set: function(v) { _restrict = v; }
  });

  prop(_scope, "autofocus", {
    get: function() { return _scope.getAttr("autofocus"); },
    set: function(v) {
      if (v) _scope.setAttr("autofocus", "autofocus");
      else _scope.removeAttr("autofocus");
    }
  });
  
  function onKeyUp(e) {
    checkRestrict();
  }

  function onChange() {
    checkRestrict();
  }
  
  function checkRestrict() {
    if (_restrict) _scope.val = _scope.val.replace(new RegExp("(?!" + _restrict + ").", "g"), '');
  }
});
