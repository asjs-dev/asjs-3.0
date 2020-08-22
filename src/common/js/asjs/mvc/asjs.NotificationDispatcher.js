require("./asjs.NotificationHandler.js");

createClass(ASJS, "NotificationDispatcher", BaseClass, function(_scope, _super) {
  var _nHandler = ASJS.NotificationHandler.instance;

  _super.protected.sendNotification = _nHandler.sendNotification;
  _super.protected.addHandler       = _nHandler.add;
  _super.protected.removeHandler    = _nHandler.remove;

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _nHandler = null;
    _super.destruct();
  }
});
