require("../../../../common/js/mediator/AbstractResizeMediator.js");
require("../../../../common/js/utils/dataUtils/Language.js");
require("./view/NotificationWindowView.js");

createClass(NS, "NotificationWindowMediator", ASJSUtils.AbstractResizeMediator, function(_scope, _super) {
  var _language = ASJSUtils.Language.instance;

  var _pool               = [];
  var _showed             = false;
  var _defaultOkLabel     = "";
  var _defaultCancelLabel = "";
  var _view               = new NS.NotificationWindowView();

  _scope.new = function(root) {
    _super.new(root);
    _super.protected.addHandler(NS.NotificationWindowMediator.SHOW, onShow);

    _view.addEventListener(NS.NotificationWindowMediator.HIDE, hide);
    _defaultOkLabel     = _language.getText('notification_ok_button');
    _defaultCancelLabel = _language.getText('notification_cancel_button');
  }

  function onShow(data) {
    if (empty(data)) data = new NS.NotificationDataVo();

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
    _super.protected.view.removeChild(_view);
    _showed = false;
  }

  function showWindow() {
    var notificationItem = _pool[0];
    _pool.shift();
    _showed = true;
    _view.showWindow(notificationItem);

    if (!_super.protected.view.contains(_view)) _super.protected.view.addChild(_view);

    _super.protected.showView();
  }
});
msg(NS.NotificationWindowMediator, "SHOW");
msg(NS.NotificationWindowMediator, "HIDE");
