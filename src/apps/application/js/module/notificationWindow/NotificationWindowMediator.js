require("../../../../../common/js/common/dataUtils/Language.js");
require("../../mediator/AbstractResizeMediator.js");
require("./view/NotificationWindowView.js");
require("./model/vo/NotificationWindowDataVo.js");

var NotificationWindowMediator = createClass(
"NotificationWindowMediator",
AbstractResizeMediator,
function(_scope, _super) {
  var _language = Language.instance;

  var _pool                   = [];
  var _showed                 = false;
  var _defaultOkLabel         = "";
  var _defaultCancelLabel     = "";
  var _notificationWindowView = new NotificationWindowView();

  _scope.new = function(root) {
    _super.new(root);
    _super.protected.addHandler(NotificationWindowMediator.SHOW, onShow);

    _notificationWindowView.addEventListener(NotificationWindowMediator.HIDE, hide);
    _defaultOkLabel     = _language.getText('notification_ok_button');
    _defaultCancelLabel = _language.getText('notification_cancel_button');
  }

  function onShow(data) {
    if (empty(data)) data = new NotificationDataVo();

    if (!data.okLabel) data.okLabel = _defaultOkLabel;
    if (!data.cancelLabel) data.cancelLabel = _defaultCancelLabel;

    _pool.push(data);

    if (!_showed) showWindow();
  }

  function hide() {
    if (_pool.length > 0) showWindow();
    else hideWindow();
  }

  function hideWindow() {
    _super.protected.view.removeChild(_notificationWindowView);
    _showed = false;
  }

  function showWindow() {
    var notificationItem = _pool[0];
    _pool.shift();
    _showed = true;
    _notificationWindowView.showWindow(notificationItem);

    if (!_super.protected.view.contains(_notificationWindowView)) _super.protected.view.addChild(_notificationWindowView);

    _super.protected.showView();
  }
});
msg(NotificationWindowMediator, "SHOW", "show");
msg(NotificationWindowMediator, "HIDE", "hide");
