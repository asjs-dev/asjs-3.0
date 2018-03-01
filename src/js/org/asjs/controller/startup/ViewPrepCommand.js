ASJS.import("org/asjs/module/content/ContentMediator.js");
ASJS.import("org/asjs/module/externalApplication/ExternalApplicationMediator.js");
ASJS.import("org/asjs/module/notificationWindow/NotificationWindowMediator.js");

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

