require("../../event/asjs.Event.js");
require("../asjs.DisplayObject.js");
require("./asjs.FormElement.js");

helpers.createClass(ASJS, "Checkbox", ASJS.FormElement, function(_scope, _super) {
  var _checkbox = new ASJS.DisplayObject("input");
  var _label    = new ASJS.DisplayObject();

  helpers.override(_scope, _super, "new");
  _scope.new = function() {
    _super.new("label");

    _checkbox.setAttr("type", "checkbox");
    _checkbox.visible = false;
    _scope.addChild(_checkbox);

    _label.setSize("100%", "100%");
    _label.enabled = false;
    _scope.addChild(_label);
  }

  helpers.get(_scope, "label", function() { return _label; });

  helpers.get(_scope, "checkbox", function() { return _checkbox; });

  helpers.override(_scope, _super, "enabled");
  helpers.set(_scope, "enabled", function(v) { _super.enabled = _checkbox.enabled = v; });

  helpers.property(_scope, "name", {
    get: _checkbox.getAttr.bind(_checkbox, "name"),
    set: _checkbox.setAttr.bind(_checkbox, "name")
  });

  helpers.property(_scope, "checked", {
    get: function() { return _checkbox.el.checked; },
    set: function(v) {
      _checkbox.el.checked = v;
      _checkbox.dispatchEvent(ASJS.Event.CHANGE);
    }
  });

  helpers.override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _checkbox.destruct();
    _label.destruct();

    _checkbox =
    _label    = null;

    _super.destruct();
  }
});
