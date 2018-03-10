require("../asjs.NotificationDispatcher.js");
require("../../display/asjs.Sprite.js");

ASJS.AbstractMediator = createClass(
"AbstractMediator",
ASJS.NotificationDispatcher,
function(_scope, _super) {
  _super.protected.view = new ASJS.Sprite();

  _scope.new = function(root) {
    root.addChild(_super.protected.view);
  }
});
