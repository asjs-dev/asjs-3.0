require("./asjs.FormElement.js");

createClass(ASJS, "Button", ASJS.FormElement, function(_scope, _super) {
  override(_scope, _super, "new");
  _scope.new = function() {
    _super.new("input");
    _scope.setAttr("type", "button");
  }

  ASJS.Tag.attrProp(_scope, "label", "value");

  prop(_scope, "submit", {
    get: function() { return _scope.getAttr("type") === "submit"; },
    set: function(v) { _scope.setAttr("type", v ? "submit" : "button"); }
  });
});
