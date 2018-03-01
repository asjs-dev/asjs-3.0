ASJS.import("com/asjs/display/form/asjs.FormElement.js");
ASJS.import("com/asjs/display/asjs.PrimitiveDisplayObject.js");

ASJS.DropDownOption = createClass(
"DropDownOption",
ASJS.PrimitiveDisplayObject,
function(_scope, _super) {
  _scope.new = function(value, label, disabled, selected) {
    _super.new("option");
    _scope.value = value || 0;
    _scope.label = label || "";
    _scope.disabled = disabled || false;
    _scope.selected = selected || false;
  }
  
  prop(_scope, "value", {
    get: function() { return _scope.getAttr("value"); },
    set: function(v) { _scope.setAttr("value", v); }
  });

  prop(_scope, "label", {
    get: function() { return _scope.text; },
    set: function(v) { _scope.text = v; }
  });

  prop(_scope, "selected", {
    get: function() { return _scope.getAttr("selected"); },
    set: function(v) {
      if (v) _scope.setAttr("selected", "selected");
      else _scope.removeAttr("selected");
    }
  });

  prop(_scope, "disabled", {
    get: function() { return _scope.getAttr("disabled"); },
    set: function(v) {
      if (v) _scope.setAttr("disabled", "disabled");
      else _scope.removeAttr("disabled");
    }
  });
});
