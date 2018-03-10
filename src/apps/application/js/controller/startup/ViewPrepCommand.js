require("../../module/content/ContentMediator.js");
require("../../module/externalApplication/ExternalApplicationMediator.js");
require("../../module/notificationWindow/NotificationWindowMediator.js");

var ViewPrepCommand = createClass(
"ViewPrepCommand",
ASJS.AbstractCommand,
function(_scope) {
  _scope.execute = function(app) {
    new ContentMediator(app);
    new ExternalApplicationMediator(app);
    new NotificationWindowMediator(app);

    _scope.sendNotification(ContentMediator.SHOW);
  }
});

