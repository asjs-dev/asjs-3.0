require("../../module/externalApplication/ExternalApplicationMediator.js");
require("../../module/notificationWindow/NotificationWindowMediator.js");
require("../../module/content/ContentMediator.js");

createClass(NS, "ViewPrepCommand", ASJS.AbstractCommand, function(_scope, _super) {
  _scope.execute = function(app) {
    new NS.ContentMediator(app);
    new NS.ExternalApplicationMediator(app);
    new NS.NotificationWindowMediator(app);

    _super.protected.sendNotification(NS.ContentMediator.SHOW);

    _scope.destruct();
  }
});
