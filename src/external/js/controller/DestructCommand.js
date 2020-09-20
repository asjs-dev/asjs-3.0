require("../../../common/js/helpers/createClass.js");

require("../NameSpace.js");
require("../module/content/ContentMediator.js");

helpers.createClass(NS, "DestructCommand", ASJS.AbstractCommand, function(_scope, _super) {
  _scope.execute = function() {
    _super.protected.sendNotification(NS.ContentMediator.DESTRUCT);
    _scope.destruct();
  }
});
