require("../../../../common/js/utils/dataUtils/Language.js");
require("../../../../common/js/mediator/AbstractResizeMediator.js");
require("./view/ContentView.js");
require("../notificationWindow/NotificationWindowMediator.js");
require("../notificationWindow/vo/NotificationWindowDataVo.js");
require("../externalApplication/ExternalApplicationMediator.js");

var ContentMediator = createClass(
"ContentMediator",
AbstractResizeMediator,
function(_scope, _super) {
  var _language = Language.instance;
  var _view     = new ContentView();

  _scope.new = function(root) {
    _super.new(root);

    _super.protected.addHandler(ContentMediator.SHOW, onShow);

    _view.addEventListener(ContentMediator.ON_SHOW_NOTIFICATION_WINDOW,  showNotificationWindow);
    _view.addEventListener(ContentMediator.ON_SHOW_EXTERNAL_APPLICATION, showExternalApplication);
  }

  function onShow() {
    _super.protected.showView();
    if (!_super.protected.view.contains(_view)) _super.protected.view.addChild(_view);
  }

  function showNotificationWindow() {
    var notificationWindowDataVo         = new NotificationWindowDataVo();
        notificationWindowDataVo.title   = _language.getText("notification_title");
        notificationWindowDataVo.content = _language.getText("notification_content");
        notificationWindowDataVo.height  = 230;
    _scope.sendNotification(NotificationWindowMediator.SHOW, notificationWindowDataVo);
  }

  function showExternalApplication() {
    _scope.sendNotification(ExternalApplicationMediator.SHOW);
  }
});
msg(ContentMediator, "SHOW",                         "show");
msg(ContentMediator, "ON_SHOW_EXTERNAL_APPLICATION", "onShowExternalApplication");
msg(ContentMediator, "ON_SHOW_NOTIFICATION_WINDOW",  "onShowNotificationWindow");
