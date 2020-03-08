require("../../display/asjs.Sprite.js");
require("./asjs.AbstractMediator.js");

createClass(ASJS, "AbstractViewMediator", ASJS.AbstractMediator, function(_scope, _super) {
  var _root;

  get(_super.protected, "isViewAttached", function() { return _root.contains(_super.protected.view); });

  _scope.new = function(root) {
    _root = root;
    _super.protected.addHandler(ASJS.Stage.RESIZE, onResize);
  }

  _scope.destruct = function() {
    _super.protected.removeHandler(ASJS.Stage.RESIZE, onResize);

    _super.protected.view.destruct();
    destructClass(_super.protected.view);
    _super.protected.view = null;
    _root = null;

    _super.destruct();
  }

  _super.protected.show = function() {
    if (!_super.protected.isViewAttached) {
      _root.addChild(_super.protected.view);
      _super.protected.render();
    }
  }

  _super.protected.hide = function() {
    _super.protected.isViewAttached && _root.removeChild(_super.protected.view);
  }

  _super.protected.render = function() {
    _super.protected.isViewAttached && _super.protected.view.render();
  }

  var onResize = _super.protected.render;
});
