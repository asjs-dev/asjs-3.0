ASJS.import("org/asjs/mediator/AbstractResizeMediator.js");
ASJS.import("com/commons/dataUtils/Language.js");
ASJS.import("org/asjs/controller/service/LoadJSONServiceCommand.js");
ASJS.import("org/asjs/module/content/view/ContentView.js");
ASJS.import("org/asjs/module/notificationWindow/NotificationWindowMediator.js");
ASJS.import("org/asjs/module/notificationWindow/model/vo/NotificationWindowDataVo.js");
ASJS.import("org/asjs/module/externalApplication/ExternalApplicationMediator.js");

var ContentMediator = createClass(
"ContentMediator",
AbstractResizeMediator,
function(_scope, _super) {
  var _language    = Language.instance;
  var _contentView = new ContentView();
  
  _scope.new = function(root) {
    _super.new(root);
    _super.protected.addHandler(ContentMediator.SHOW, onShow);
    
    _contentView.addEventListener(ContentMediator.ON_SHOW_NOTIFICATION_WINDOW,  showNotificationWindow);
    _contentView.addEventListener(ContentMediator.ON_SHOW_EXTERNAL_APPLICATION, showExternalApplication);
  }
  
  function onShow() {
    _super.protected.showView();
    if (!_super.protected.view.contains(_contentView)) _super.protected.view.addChild(_contentView);
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
