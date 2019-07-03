require("../module/content/ContentMediator.js");

createClass(NS, "DestructCommand", ASJS.AbstractCommand, function(_scope) {
  _scope.execute = function() {
    _scope.sendNotification(NS.ContentMediator.DESTRUCT);
    _scope.destruct();
  }
});
