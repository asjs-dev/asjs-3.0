require("../../../../common/js/mediator/AbstractResizeMediator.js");
require("./view/ContentView.js");

var ContentMediator = createClass(
"ContentMediator",
AbstractResizeMediator,
function(_scope, _super) {
  var _contentView = new ContentView();

  _scope.new = function(root) {
    _super.new(root);
    _super.protected.addHandler(ContentMediator.SHOW,     onShow);
    _super.protected.addHandler(ContentMediator.DESTRUCT, onDestruct);
  }

  _scope.destruct = function() {
    _super.protected.removeHandler(ContentMediator.SHOW,     onShow);
    _super.protected.removeHandler(ContentMediator.DESTRUCT, onDestruct);
    _contentView.destruct();
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
msg(ContentMediator, "SHOW");
msg(ContentMediator, "DESTRUCT");
