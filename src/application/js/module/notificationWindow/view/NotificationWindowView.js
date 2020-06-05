require("../../../../../common/js/view/AbstractAnimatedView.js");
require("../NotificationWindowMediator.js");

createClass(NS, "NotificationWindowView", ASJSUtils.AbstractAnimatedView, function(_scope, _super) {
  var _notificationItem = {};

  var _window       = new ASJS.Scale9Grid();
  var _container    = new ASJS.Sprite();
  var _title        = new ASJS.Sprite();
  var _content      = new ASJS.Sprite();
  var _okButton     = new ASJS.Button();
  var _cancelButton = new ASJS.Button();
  var _scrollBar    = new ASJS.ScrollBar();

  override(_scope, _super, "new");
  _scope.new = function() {
    _super.new();

    _scope.addClass("notification-window-view");

    _window.addClass("window");
    _window.init(
      "images/window.png?v={{date}}",
      ASJS.Rectangle.create(13, 60, 4, 7)
    );
    _scope.addChild(_window);

    _container.addClass("container");
    _scope.addChild(_container);

    _title.addClass("title-label");
    _container.addChild(_title);

    _content.addClass("content-label");

    _scrollBar.addClass("scrollbar");
    _scrollBar.horizontalAngle =
    _scrollBar.verticalAngle   = -1;
    _scrollBar.scrollSpeed     = 0.15;
    _scrollBar.container.addClass("animate");
    _scrollBar.container.addChild(_content);
    _scrollBar.verticalScrollBar.addClass("animate scrollbar-vertical");
    _scrollBar.horizontalScrollBar.addClass("animate scrollbar-horizontal");
    _container.addChild(_scrollBar);

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

      destruct();

      hasOkButton() && _scope.removeChild(_okButton);
      hasCancelButton() && _scope.removeChild(_cancelButton);
    });
  }

  _scope.showWindow = function(notificationItem) {
    destruct();

    _notificationItem = notificationItem;

    if (tis(_notificationItem.title, "string")) _title.html = _notificationItem.title;
    else if (is(_notificationItem.title, ASJS.Tag)) _title.addChild(_notificationItem.title);

    if (tis(_notificationItem.content, "string")) _content.html = _notificationItem.content;
    else if (is(_notificationItem.content, ASJS.Tag)) _content.addChild(_notificationItem.content);

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

    _scrollBar.setSize(
      _container.width - _scrollBar.x * 2,
      (_container.height - _scrollBar.y) - (hasOkButton() || hasCancelButton() ? (_okButton.height + 20) : 0) - 25
    );

    isTag(_notificationItem.title) && _notificationItem.title.render && _notificationItem.title.render();
    isTag(_notificationItem.content) && _notificationItem.content.render && _notificationItem.content.render();

    requestAnimationFrame(_scrollBar.update);

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

  function destruct() {
    if (_notificationItem) {
      isTag(_notificationItem.title) && _title.removeChild(_notificationItem.title);
      isTag(_notificationItem.content) && _content.removeChild(_notificationItem.content);
    }

    _title.text         =
    _content.text       =
    _okButton.label     =
    _cancelButton.label = "";
  }

  function isTag(data) {
    return tis(data, "object") && is(data, ASJS.Tag);
  }
});
