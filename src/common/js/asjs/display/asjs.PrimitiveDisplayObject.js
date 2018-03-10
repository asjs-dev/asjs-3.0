require("./asjs.Tag.js");
require("../utils/asjs.CSS.js");

ASJS.PrimitiveDisplayObject = createClass(
"PrimitiveDisplayObject",
ASJS.Tag,
function(_scope, _super) {
  _scope.new = function(tag) {
    _super.new(tag);
    _scope.id = "instance_" + (++ASJS.PrimitiveDisplayObject.instanceId);
  }

  prop(_scope, "id", {
    get: function() { return _scope.getAttr("id"); },
    set: function(v) { _scope.setAttr("id", v); }
  });

  prop(_scope, "enabled", {
    get: function() { return _scope.getAttr("disabled") != "disabled"; },
    set: function(v) {
      if (v) {
        _scope.removeAttr("disabled");
        _scope.setCSS("pointer-events", "auto");
      } else {
        _scope.setAttr("disabled", "disabled");
        _scope.setCSS("pointer-events", "none");
      }
    }
  });
});
ASJS.PrimitiveDisplayObject.instanceId = -1;
