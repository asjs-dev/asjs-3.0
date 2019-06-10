require("../asjs.NotificationHandler.js");

createClass(ASJS, "AbstractCommand", ASJS.BaseClass, function(_scope, _super) {
  var _nHandler = ASJS.NotificationHandler.instance;

  _scope.execute = function() {}

  _scope.sendNotification = function(type, data) {
    _nHandler.sendNotification(type, data);
  }

  _scope.destruct = function() {
    _nHandler = null;

    _super.destruct();
  }
});
