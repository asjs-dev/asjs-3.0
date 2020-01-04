require("../module/content/ContentMediator.js");

createClass(NS, "DestructCommand", ASJS.AbstractCommand, function(_scope, _super) {
  _scope.execute = function() {
    _super.protected.sendNotification(NS.ContentMediator.DESTRUCT);
    _scope.destruct();
  }
});
