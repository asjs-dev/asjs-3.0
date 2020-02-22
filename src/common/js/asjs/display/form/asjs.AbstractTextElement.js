require("../../event/asjs.KeyboardEvent.js");
require("../../event/asjs.Event.js");
require("../../utils/asjs.Keyboard.js");
require("./asjs.FormElement.js");

createClass(ASJS, "AbstractTextElement", ASJS.FormElement, function(_scope, _super) {
  var _restrict;
  var _helperElement = new ASJS.Tag();

  _scope.new = function(tag) {
    _super.new(tag);
    _scope.addEventListener(ASJS.Event.CHANGE, onChange);
    _scope.addEventListener(ASJS.Event.INPUT,  onChange);
  }

  prop(_scope, "readonly", {
    get: _scope.getAttr.bind(_scope, "readonly"),
    set: function(v) {
      v
      ? _scope.setAttr("readonly", "readonly")
      : _scope.removeAttr("readonly");
    }
  });

  prop(_scope, "placeholder", {
    get: _scope.getAttr.bind(_scope, "placeholder"),
    set: function(v) {
      _helperElement.html = v;
      _scope.setAttr("placeholder", _helperElement.text);
    }
  });

  prop(_scope, "val", {
    get: function() { return _scope.el.value; },
    set: function(v) { _scope.el.value = v; }
  });

  ASJS.Tag.attrProp(_scope, "maxChar", "maxLength");

  prop(_scope, "restrict", {
    get: function() { return _restrict; },
    set: function(v) { _restrict = v; }
  });

  prop(_scope, "autofocus", {
    get: _scope.getAttr.bind(_scope, "autofocus"),
    set: function(v) {
      v
      ? _scope.setAttr("autofocus", "autofocus")
      : _scope.removeAttr("autofocus");
    }
  });

  _scope.destruct = function() {
    _restrict = null;
    _helperElement.destruct();
    _helperElement = null;

    _super.destruct();
  }

  var onChange = checkRestrict;

  function checkRestrict() {
    if (empty(_restrict)) return;

    var caretPos = 0;

    if (document.selection) {
      var range = document.selection.createRange();
      range.moveStart('character', -_scope.el.value.length);
      caretPos = range.text.length;
    } else if (_scope.el.selectionStart || _scope.el.selectionStart === '0') {
      caretPos = _scope.el.selectionStart;
    }

    var newValue = _scope.val.replace(new RegExp("(?!" + _restrict + ").", "g"), '');
    if (newValue === _scope.val) return;

    _scope.val = newValue;

    if (document.selection) {
      var range = document.selection.createRange();
      range.move('character', caretPos - 1);
    } else if (_scope.el.selectionStart) {
      _scope.el.setSelectionRange(caretPos - 1, caretPos - 1);
    }
  }
});
