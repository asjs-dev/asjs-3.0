require("../asjs.Tag.js");
require("./asjs.FormElement.js");

helpers.createClass(ASJS, "DropDownOption", ASJS.Tag, function(_scope, _super) {
  helpers.override(_scope, _super, "new");
  _scope.new = function(value, label, disabled, selected) {
    _super.new("option");
    _scope.value    = helpers.valueOrDefault(value, 0);
    _scope.label    = helpers.valueOrDefault(label, "");
    _scope.disabled = helpers.valueOrDefault(disabled, false);
    _scope.selected = helpers.valueOrDefault(selected, false);
  }

  ASJS.Tag.attrProp(_scope, "value");

  helpers.property(_scope, "label", {
    get: function() { return _scope.text; },
    set: function(v) { _scope.text = v; }
  });

  helpers.property(_scope, "selected", {
    get: _scope.getAttr.bind(_scope, "selected"),
    set: function(v) {
      v
      ? _scope.setAttr("selected", "selected")
      : _scope.removeAttr("selected");
    }
  });

  helpers.property(_scope, "disabled", {
    get: _scope.getAttr.bind(_scope, "disabled"),
    set: function(v) {
      v
      ? _scope.setAttr("disabled", "disabled")
      : _scope.removeAttr("disabled");
    }
  });
});
