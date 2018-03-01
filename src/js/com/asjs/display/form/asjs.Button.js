ASJS.import("com/asjs/display/form/asjs.FormElement.js");

ASJS.Button = createClass(
"Button",
ASJS.FormElement,
function(_scope, _super) {
  _scope.new = function() {
    _super.new("input");
    _scope.setAttr("type", "button");
  }
  
  prop(_scope, "label", {
    get: function() { return _scope.getAttr("value"); },
    set: function(v) { _scope.setAttr("value", v); }
  });

  prop(_scope, "submit", {
    get: function() { return _scope.getAttr("type") == "submit"; },
    set: function(v) { _scope.setAttr("type", v ? "submit" : "button"); }
  });
});
