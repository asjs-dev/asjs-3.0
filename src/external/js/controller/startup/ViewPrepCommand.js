require("../../module/content/ContentMediator.js");

createClass(NS, "ViewPrepCommand", ASJS.AbstractCommand, function(_scope) {
  _scope.execute = function(app) {
    new NS.ContentMediator(app);
    _scope.sendNotification(NS.ContentMediator.SHOW);
    _scope.destruct();
  }
});
