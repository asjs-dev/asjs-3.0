require("../../display/asjs.Sprite.js");
require("../asjs.NotificationDispatcher.js");

ASJS.AbstractMediator = createClass(
"AbstractMediator",
ASJS.NotificationDispatcher,
function(_scope, _super) {
  _super.protected.view = new ASJS.Sprite();

  _scope.new = function(root) {
    root.addChild(_super.protected.view);
  }

  _scope.destruct = function() {
    destructClass(_super.protected.view);
    _super.protected.view = null;

    _super.destruct();
  }
});
