require("../asjs.Tag.js");
require("./asjs.FormElement.js");

createClass(ASJS, "DropDownOption", ASJS.Tag, function(_scope, _super) {
  _scope.new = function(value, label, disabled, selected) {
    _super.new("option");
    _scope.value = valueOrDefault(value, 0);
    _scope.label = valueOrDefault(label, "");
    _scope.disabled = valueOrDefault(disabled, false);
    _scope.selected = valueOrDefault(selected, false);
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
