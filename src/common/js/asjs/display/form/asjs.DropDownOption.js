require("../asjs.Tag.js");
require("./asjs.FormElement.js");

createClass(ASJS, "DropDownOption", ASJS.Tag, function(_scope, _super) {
  _scope.new = function(value, label, disabled, selected) {
    _super.new("option");
    _scope.value = value || 0;
    _scope.label = label || "";
    _scope.disabled = disabled || false;
    _scope.selected = selected || false;
  }

  ASJS.Tag.attrProp(_scope, "value");

  prop(_scope, "label", {
    get: function() { return _scope.text; },
    set: function(v) { _scope.text = v; }
  });

  prop(_scope, "selected", {
    get: _scope.getAttr.bind(_scope, "selected"),
    set: function(v) {
      v
      ? _scope.setAttr("selected", "selected")
      : _scope.removeAttr("selected");
    }
  });

  prop(_scope, "disabled", {
    get: _scope.getAttr.bind(_scope, "disabled"),
    set: function(v) {
      v
      ? _scope.setAttr("disabled", "disabled")
      : _scope.removeAttr("disabled");
    }
  });
});
