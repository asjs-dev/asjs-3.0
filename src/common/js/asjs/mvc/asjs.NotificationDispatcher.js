require("./asjs.NotificationHandler.js");

createClass(ASJS, "NotificationDispatcher", ASJS.BaseClass, function(_scope, _super) {
  var _nHandler = ASJS.NotificationHandler.instance;

  _scope.sendNotification        = _nHandler.sendNotification;
  _super.protected.addHandler    = _nHandler.add;
  _super.protected.removeHandler = _nHandler.remove;

  _scope.destruct = function() {
    _nHandler = null;
    _super.destruct();
  }
});
