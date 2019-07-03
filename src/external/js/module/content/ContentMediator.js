require("../../../../common/js/mediator/AbstractResizeMediator.js");
require("./view/ContentView.js");

createClass(NS, "ContentMediator", ASJSUtils.AbstractResizeMediator, function(_scope, _super) {
  var _contentView = new NS.ContentView();

  _scope.new = function(root) {
    _super.new(root);
    _super.protected.addHandler(NS.ContentMediator.SHOW,     onShow);
    _super.protected.addHandler(NS.ContentMediator.DESTRUCT, onDestruct);
  }

  _scope.destruct = function() {
    _super.protected.removeHandler(NS.ContentMediator.SHOW,     onShow);
    _super.protected.removeHandler(NS.ContentMediator.DESTRUCT, onDestruct);

    _contentView.destruct();
    _contentView = null;

    _super.destruct();
  }

  function onShow() {
    if (!_super.protected.view.contains(_contentView)) _super.protected.view.addChild(_contentView);
    _super.protected.showView();
  }

  function onDestruct() {
    _scope.destruct();
  }
});
msg(NS.ContentMediator, "SHOW");
msg(NS.ContentMediator, "DESTRUCT");
