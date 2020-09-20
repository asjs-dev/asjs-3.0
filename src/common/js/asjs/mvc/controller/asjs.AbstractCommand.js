require("../asjs.NotificationHandler.js");

helpers.createClass(ASJS, "AbstractCommand", ASJS.NotificationDispatcher, function(_scope, _super) {
  _scope.execute = function() {};
});
