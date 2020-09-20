require("../../../../common/js/helpers/createClass.js");

require("../../NameSpace.js");
require("../../module/content/ContentMediator.js");

helpers.createClass(NS, "ViewPrepCommand", ASJS.AbstractCommand, function(_scope, _super) {
  _scope.execute = function(app) {
    new NS.ContentMediator(app);
    _super.protected.sendNotification(NS.ContentMediator.SHOW);
    _scope.destruct();
  }
});
