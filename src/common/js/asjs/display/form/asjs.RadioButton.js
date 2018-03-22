require("./asjs.FormElement.js");
require("../asjs.DisplayObject.js");

ASJS.RadioButton = createClass(
"RadioButton",
ASJS.FormElement,
function(_scope, _super) {
  var _radio = new ASJS.DisplayObject("input");
  var _label = new ASJS.DisplayObject();

  _scope.new = function() {
    _super.new("label");
    _radio.setAttr("type", "radio");
    _radio.visible = false;
    _scope.addChild(_radio);

    _label.setSize("100%", "100%");
    _label.enabled = false;
    _scope.addChild(_label);
  }

  get(_scope, "radio", function() { return _radio; });

  set(_scope, "enabled", function(v) {
    _super.enabled = _radio.enabled = v;
  });

  prop(_scope, "name", {
    get: function() { return _radio.getAttr("name"); },
    set: function(v) { _radio.setAttr("name", v); }
  });

  prop(_scope, "checked", {
    get: function() { return _radio.el.checked; },
    set: function(v) {
      _radio.el.checked = v;
      if (v) _radio.el.change();
    }
  });

  prop(_scope, "val", {
    get: function() { return _radio.value; },
    set: function(v) { _radio.value = v; }
  });
});
