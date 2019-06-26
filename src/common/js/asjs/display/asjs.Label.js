require("./asjs.DisplayObject.js");

createClass(ASJS, "Label", ASJS.DisplayObject, function(_scope, _super) {
  _scope.new = function() {
    _super.new("label");
  }

  prop(_scope, "for", {
    get: function() { return _scope.getAttr("for"); },
    set: function(v) { _scope.setAttr("for", v); }
  });
});
