ASJS.import("com/asjs/mvc/asjs.NotificationDispatcher.js");

ASJS.AbstractCommand = createClass(
"AbstractCommand",
ASJS.NotificationDispatcher,
function(_scope) {
  _scope.execute = function() {}
});
