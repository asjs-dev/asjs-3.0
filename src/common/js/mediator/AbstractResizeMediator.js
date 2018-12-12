var AbstractResizeMediator = createClass(
"AbstractMediator",
ASJS.AbstractMediator,
function(_scope, _super) {
  _super.protected.forceResize = true;

  _scope.new = function(root) {
    _super.new(root);
    _super.protected.addHandler(ASJS.Stage.RESIZE, _super.protected.onResize);
  }

  _scope.destruct = function() {
  _super.protected.removeHandler(ASJS.Stage.RESIZE, _super.protected.onResize);
    _super.destruct();
  }

  _super.protected.showView = function() {
    if (_super.protected.forceResize) _super.protected.onResize();
  }

  _super.protected.onResize = function() {
    _super.protected.forceResize = true;

    var child = _super.protected.view.getChildAt(0);

    if (empty(child)) return;

    child.render();

    _super.protected.forceResize = false;
  }
});
