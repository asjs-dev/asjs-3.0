require("mvc/asjs.NotificationHandler.js");

ASJS.NotificationDispatcher = createClass(
"NotificationDispatcher",
ASJS.BaseClass,
function(_scope, _super) {
  var _nHandler = ASJS.NotificationHandler.instance;

  _scope.sendNotification = function(type, data) {
    _nHandler.sendNotification(type, data);
  }

  _super.protected.addHandler = function(type, callback) {
    _nHandler.add(type, callback);
  }
  
  _super.protected.removeHandler = function(type, callback) {
    _nHandler.remove(type, callback);
  }
});
