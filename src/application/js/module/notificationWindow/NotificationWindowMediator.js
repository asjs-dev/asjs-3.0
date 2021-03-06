require("../../../../common/js/helpers/createClass.js");
require("../../../../common/js/helpers/isEmpty.js");
require("../../../../common/js/helpers/message.js");
require("../../../../common/js/utils/dataUtils/Language.js");

require("../../NameSpace.js");
require("./view/NotificationWindowView.js");

helpers.createClass(NS, "NotificationWindowMediator", ASJS.AbstractViewMediator, function(_scope, _super) {
  var _view = _super.protected.view = new NS.NotificationWindowView();

  var _language = ASJSUtils.Language.instance;

  var _pool               = [];
  var _showed             = false;
  var _defaultOkLabel     = "";
  var _defaultCancelLabel = "";

  helpers.override(_scope, _super, "new");
  _scope.new = function(root) {
    _super.new(root);

    _super.protected.addHandler(NS.NotificationWindowMediator.SHOW, onShow);

    _view.addEventListener(NS.NotificationWindowMediator.HIDE, onHide);

    _defaultOkLabel     = _language.getText('notification_ok_button');
    _defaultCancelLabel = _language.getText('notification_cancel_button');
  }

  function onShow(data) {
    if (helpers.isEmpty(data)) data = new NS.NotificationDataVo();

    if (!data.okLabel) data.okLabel = _defaultOkLabel;
    if (!data.cancelLabel) data.cancelLabel = _defaultCancelLabel;

    _pool.push(data);

    if (!_showed) showWindow();
  }

  function onHide() {
    _pool.length > 0
      ? showWindow()
      : hideWindow();
  }

  function hideWindow() {
    _super.protected.hide();
    _showed = false;
  }

  function showWindow() {
    var notificationItem = _pool.shift();
    _showed = true;
    _view.showWindow(notificationItem);

    _super.protected.show();
  }
});
helpers.message(NS.NotificationWindowMediator, "SHOW");
helpers.message(NS.NotificationWindowMediator, "HIDE");
