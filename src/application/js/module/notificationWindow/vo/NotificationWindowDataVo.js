createClass(NS, "NotificationWindowDataVo", ASJS.BaseClass, function(_scope) {
  _scope.new = function() {
    _scope.title          = "";
    _scope.content        = "";
    _scope.showOk         = true;
    _scope.showCancel     = false;
    _scope.okCallback     = null;
    _scope.cancelCallback = null;
    _scope.okLabel        = null;
    _scope.cancelLabel    = null;
    _scope.width          = 500;
    _scope.height         = 200;
  }
});
