require("../module/content/ContentMediator.js");

var DestructCommand = createClass(
"DestructCommand",
ASJS.AbstractCommand,
function(_scope) {
  _scope.execute = function(app) {
    _scope.sendNotification(ContentMediator.DESTRUCT)
  }
});
