require("../../../../common/js/helpers/createClass.js");
require("../../../../common/js/helpers/message.js");

require("../../NameSpace.js");
require("./view/ContentView.js");

helpers.createClass(NS, "ContentMediator", ASJS.AbstractViewMediator, function(_scope, _super) {
  var _view = _super.protected.view = new NS.ContentView();

  helpers.override(_scope, _super, "new");
  _scope.new = function(root) {
    _super.new(root);
    _super.protected.addHandler(NS.ContentMediator.SHOW,     onShow);
    _super.protected.addHandler(NS.ContentMediator.DESTRUCT, onDestruct);
  }

  helpers.override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _super.protected.removeHandler(NS.ContentMediator.SHOW,     onShow);
    _super.protected.removeHandler(NS.ContentMediator.DESTRUCT, onDestruct);

    _super.destruct();
  }

  function onShow() {
    _super.protected.show();
  }

  function onDestruct() {
    _scope.destruct();
  }
});
helpers.message(NS.ContentMediator, "SHOW");
helpers.message(NS.ContentMediator, "DESTRUCT");
