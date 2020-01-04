require("./view/ContentView.js");

createClass(NS, "ContentMediator", ASJS.AbstractViewMediator, function(_scope, _super) {
  var _view = _super.protected.view = new NS.ContentView();

  _scope.new = function(root) {
    _super.new(root);
    _super.protected.addHandler(NS.ContentMediator.SHOW,     onShow);
    _super.protected.addHandler(NS.ContentMediator.DESTRUCT, onDestruct);
  }

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
msg(NS.ContentMediator, "SHOW");
msg(NS.ContentMediator, "DESTRUCT");
