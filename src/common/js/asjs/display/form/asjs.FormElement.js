ASJS.FormElement = createClass(
"FormElement",
ASJS.Sprite,
function(_scope, _super) {
  _scope.new = function(tag) {
    _super.new(tag);
    _scope.tabIndex = "auto";
  }
  
  prop(_scope, "name", {
    get: function() { return _scope.getAttr("name"); },
    set: function(v) { _scope.setAttr("name", v); }
  });
});
