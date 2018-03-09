require("display/form/asjs.FormElement.js");
require("display/asjs.DisplayObject.js");
require("event/asjs.Event.js");

ASJS.Checkbox = createClass(
"Checkbox",
ASJS.FormElement,
function(_scope, _super) {
  var _checkbox = new ASJS.DisplayObject("input");
  var _label    = new ASJS.DisplayObject();
  
  _scope.new = function() {
    _super.new("label");
    _checkbox.setAttr("type", "checkbox");
    _checkbox.visible = false;
    _scope.addChild(_checkbox);

    _label.setSize("100%", "100%");
    _label.enabled = false;
    _scope.addChild(_label);
  }
  
  get(_scope, "label", function() { return _label; });

  get(_scope, "checkbox", function() { return _checkbox; });
  
  set(_scope, "enabled", function(v) {
    _super.enabled = _checkbox.enabled = v;
    _scope.render();
  });

  prop(_scope, "name", {
    get: function() { return _checkbox.getAttr("name"); },
    set: function(v) { _checkbox.setAttr("name", v); }
  });

  prop(_scope, "checked", {
    get: function() { return _checkbox.el.checked; },
    set: function(v) {
      _checkbox.el.checked = v;
      _checkbox.dispatchEvent(ASJS.Event.CHANGE);
    }
  });
});
