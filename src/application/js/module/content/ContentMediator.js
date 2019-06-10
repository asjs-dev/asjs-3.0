require("../../../../common/js/mediator/AbstractResizeMediator.js");
require("../../../../common/js/utils/dataUtils/Language.js");
require("../externalApplication/ExternalApplicationMediator.js");
require("../notificationWindow/vo/NotificationWindowDataVo.js");
require("../notificationWindow/NotificationWindowMediator.js");
require("./view/ContentView.js");

createClass(NS, "ContentMediator", ASJSUtils.AbstractResizeMediator, function(_scope, _super) {
  var _language = ASJSUtils.Language.instance;
  var _view     = new NS.ContentView();

  _scope.new = function(root) {
    _super.new(root);

    _super.protected.addHandler(NS.ContentMediator.SHOW, onShow);

    _view.addEventListener(NS.ContentMediator.ON_SHOW_NOTIFICATION_WINDOW,  showNotificationWindow);
    _view.addEventListener(NS.ContentMediator.ON_SHOW_EXTERNAL_APPLICATION, showExternalApplication);
  }

  function onShow() {
    _super.protected.showView();
    if (!_super.protected.view.contains(_view)) _super.protected.view.addChild(_view);
  }

  function showNotificationWindow() {
    var notificationWindowDataVo         = new NS.NotificationWindowDataVo();
        notificationWindowDataVo.title   = _language.getText("notification_title");
        notificationWindowDataVo.content = _language.getText("notification_content");
        notificationWindowDataVo.height  = 230;
    _scope.sendNotification(NS.NotificationWindowMediator.SHOW, notificationWindowDataVo);
  }

  function showExternalApplication() {
    _scope.sendNotification(NS.ExternalApplicationMediator.SHOW);
  }
});
msg(NS.ContentMediator, "SHOW");
msg(NS.ContentMediator, "ON_SHOW_EXTERNAL_APPLICATION");
msg(NS.ContentMediator, "ON_SHOW_NOTIFICATION_WINDOW");
