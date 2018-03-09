require("display/asjs.DisplayObject.js");

ASJS.Label = createClass(
"Label",
ASJS.DisplayObject,
function(_scope, _super) {
  var _for;
  
  _scope.new = function() {
    _super.new("label");
  }

  prop(_scope, "for", {
    get: function() { return _for; },
    set: function(v) {
      if (v && v.id) {
        _for = v;
        _scope.setAttr("for", _for.id);
      }
    }
  });
});
