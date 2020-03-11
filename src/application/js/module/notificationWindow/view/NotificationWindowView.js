require("../../../../../common/js/view/AbstractAnimatedView.js");
require("../NotificationWindowMediator.js");

createClass(NS, "NotificationWindowView", ASJSUtils.AbstractAnimatedView, function(_scope, _super) {
  var _notificationItem = {};

  var _window       = new ASJS.Scale9Grid();
  var _container    = new ASJS.Sprite();
  var _title        = new ASJS.Label();
  var _content      = new ASJS.Sprite();
  var _okButton     = new ASJS.Button();
  var _cancelButton = new ASJS.Button();

  _scope.new = function() {
    _super.new();

    _scope.addClass("notification-window-view");

    _window.addClass("notification-window");
    _window.init(
      "images/window.png?v={{date}}",
      new ASJS.Rectangle(13, 60, 4, 7)
    );
    _scope.addChild(_window);

    _container.addClass("notification-window-container");
    _scope.addChild(_container);

    _title.addClass("title-label");
    _container.addChild(_title);

    _content.addClass("content-label");
    _container.addChild(_content);

    _okButton.addEventListener(ASJS.MouseEvent.CLICK, function() {
      _scope.hideWindow();
      !empty(_notificationItem['okCallback']) && _notificationItem['okCallback']();
    });
    _okButton.addClass("ok-button button");

    _cancelButton.addEventListener(ASJS.MouseEvent.CLICK, function() {
      _scope.hideWindow();
      !empty(_notificationItem['cancelCallback']) && _notificationItem['cancelCallback']();
    });
    _cancelButton.addClass("cancel-button button");
  }

  _scope.hideWindow = function() {
    _super.protected.animateTo(0, function() {
      _scope.dispatchEvent(NS.NotificationWindowMediator.HIDE);

      _title.html         =
      _content.html       =
      _okButton.label     =
      _cancelButton.label = "";

      hasOkButton() && _scope.removeChild(_okButton);
      hasCancelButton() && _scope.removeChild(_cancelButton);
    });
  }

  _scope.showWindow = function(notificationItem) {
    _notificationItem = notificationItem;

    _title.html   = _notificationItem.title;
    _content.html = _notificationItem.content;

    if (_notificationItem['showOk']) {
      _okButton.label = _notificationItem['okLabel'];
      !hasOkButton() && _container.addChild(_okButton);
    } else hasOkButton() && _container.removeChild(_okButton);

    if (_notificationItem['showCancel']) {
      _cancelButton.label = _notificationItem['cancelLabel'];
      !hasCancelButton() && _container.addChild(_cancelButton);
    } else hasCancelButton() && _container.removeChild(_cancelButton);
  }

  _scope.render = function() {
    _window.setSize(
      bw(150, stage.stageWidth,  _notificationItem.width),
      bw(150, stage.stageHeight, _notificationItem.height)
    );

    _container.setSize(_window.width, _window.height);

    _content.height = (_container.height - _content.y) - (hasOkButton() || hasCancelButton() ? (_okButton.height + 20) : 0) - 25;
    _content.render && _content.render();

    if (hasOkButton()) {
      _okButton.x = hasCancelButton()
        ? _container.width * 0.5 - 10 - _okButton.width
        : ((_container.width - _okButton.width) * 0.5);
    }

    if (hasCancelButton()) {
      _cancelButton.x = hasOkButton()
        ? _container.width * 0.5 + 10
        : ((_container.width - _cancelButton.width) * 0.5);
    }
  }

  function hasOkButton() {
    return _container.contains(_okButton);
  }

  function hasCancelButton() {
    return _container.contains(_cancelButton);
  }
});
