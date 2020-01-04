require("../../module/content/ContentMediator.js");

createClass(NS, "ViewPrepCommand", ASJS.AbstractCommand, function(_scope, _super) {
  _scope.execute = function(app) {
    new NS.ContentMediator(app);
    _super.protected.sendNotification(NS.ContentMediator.SHOW);
    _scope.destruct();
  }
});
