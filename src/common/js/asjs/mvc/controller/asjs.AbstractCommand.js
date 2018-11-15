require("../asjs.NotificationHandler.js");

ASJS.AbstractCommand = createClass(
"AbstractCommand",
ASJS.BaseClass,
function(_scope) {
  var _nHandler = ASJS.NotificationHandler.instance;

  _scope.execute = function() {}

  _scope.sendNotification = function(type, data) {
    _nHandler.sendNotification(type, data);
  }
});
