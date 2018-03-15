require("../../module/content/ContentMediator.js");

var ViewPrepCommand = createClass(
"ViewPrepCommand",
ASJS.AbstractCommand,
function(_scope) {
  _scope.execute = function(app) {
    new ContentMediator(app);

    _scope.sendNotification(ContentMediator.SHOW);
  }
});
