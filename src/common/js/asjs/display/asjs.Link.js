require("./asjs.Sprite.js");

ASJS.Link = createClass(
"Link",
ASJS.Sprite,
function(_scope, _super) {
  _scope.new = function() {
    _super.new("a");
  }

  prop(_scope, "href", {
    get: function() { return _scope.getAttr("href"); },
    set: function(v) { _scope.setAttr("href", v); }
  });

  prop(_scope, "target", {
    get: function() { return _scope.getAttr("target"); },
    set: function(v) { _scope.setAttr("target", v); }
  });

  prop(_scope, "download", {
    get: function() { return _scope.getAttr("download"); },
    set: function(v) { _scope.setAttr("download", v); }
  });
});
