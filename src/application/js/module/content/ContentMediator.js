require("../../../../common/js/utils/dataUtils/Language.js");
require("../externalApplication/ExternalApplicationMediator.js");
require("../notificationWindow/vo/NotificationWindowData.js");
require("../notificationWindow/NotificationWindowMediator.js");
require("./view/ContentView.js");

createClass(NS, "ContentMediator", ASJS.AbstractViewMediator, function(_scope, _super) {
  var _view = _super.protected.view = new NS.ContentView();

  var _language = ASJSUtils.Language.instance;

  _scope.new = function(root) {
    _super.new(root);

    _super.protected.addHandler(NS.ContentMediator.SHOW, onShow);

    _view.addEventListener(NS.ContentMediator.ON_SHOW_NOTIFICATION_WINDOW,  showNotificationWindow);
    _view.addEventListener(NS.ContentMediator.ON_SHOW_EXTERNAL_APPLICATION, showExternalApplication);
  }

  function onShow() {
    _super.protected.show();
  }

  function showNotificationWindow() {
    var notificationWindowData         = NS.NotificationWindowData.create();
        notificationWindowData.title   = _language.getText("notification_title");
        notificationWindowData.content = _language.getText("notification_content");
        notificationWindowData.height  = 230;
    _super.protected.sendNotification(NS.NotificationWindowMediator.SHOW, notificationWindowData);
  }

  function showExternalApplication() {
    _super.protected.sendNotification(NS.ExternalApplicationMediator.SHOW);
  }
});
msg(NS.ContentMediator, "SHOW");
msg(NS.ContentMediator, "ON_SHOW_EXTERNAL_APPLICATION");
msg(NS.ContentMediator, "ON_SHOW_NOTIFICATION_WINDOW");
