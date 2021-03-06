require("../../event/asjs.KeyboardEvent.js");
require("../../event/asjs.Event.js");
require("../../utils/asjs.Keyboard.js");
require("./asjs.FormElement.js");

helpers.createClass(ASJS, "AbstractTextElement", ASJS.FormElement, function(_scope, _super) {
  var _helperElement = new ASJS.Tag();

  _scope.restrict;

  helpers.override(_scope, _super, "new");
  _scope.new = function(tag) {
    _super.new(tag);
    _scope.addEventListener(ASJS.Event.CHANGE, onChange);
    _scope.addEventListener(ASJS.Event.INPUT,  onChange);
  }

  helpers.property(_scope, "readonly", {
    get: _scope.getAttr.bind(_scope, "readonly"),
    set: function(v) {
      v
      ? _scope.setAttr("readonly", "readonly")
      : _scope.removeAttr("readonly");
    }
  });

  helpers.property(_scope, "placeholder", {
    get: _scope.getAttr.bind(_scope, "placeholder"),
    set: function(v) {
      _helperElement.html = v;
      _scope.setAttr("placeholder", _helperElement.text);
    }
  });

  helpers.property(_scope, "val", {
    get: function() { return _scope.el.value; },
    set: function(v) { _scope.el.value = v; }
  });

  ASJS.Tag.attrProp(_scope, "maxChar", "maxLength");

  helpers.property(_scope, "autofocus", {
    get: _scope.getAttr.bind(_scope, "autofocus"),
    set: function(v) {
      v
      ? _scope.setAttr("autofocus", "autofocus")
      : _scope.removeAttr("autofocus");
    }
  });

  helpers.override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _helperElement.destruct();

    _scope.restrict =
    _helperElement  = null;

    _super.destruct();
  }

  var onChange = checkRestrict;

  function checkRestrict() {
    if (helpers.isEmpty(_scope.restrict)) return;

    var caretPos = 0;

    if (document.selection) {
      var range = document.selection.createRange();
      range.moveStart('character', -_scope.el.value.length);
      caretPos = range.text.length;
    } else if (_scope.el.selectionStart || _scope.el.selectionStart === '0') {
      caretPos = _scope.el.selectionStart;
    }

    var newValue = _scope.val.replace(new RegExp("(?!" + _scope.restrict + ").", "g"), '');
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
