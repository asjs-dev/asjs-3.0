require("../../display/asjs.Sprite.js");
require("../asjs.NotificationDispatcher.js");

createClass(ASJS, "AbstractMediator", ASJS.NotificationDispatcher, function(_scope, _super) {
  var _container = new ASJS.Sprite();

  get(_super.protected, "isViewAttached", function() { return _container.contains(_super.protected.view); });

  _scope.new = function(root) {
    root.addChild(_container);
    _super.protected.addHandler(ASJS.Stage.RESIZE, onResize);
  }

  _scope.destruct = function() {
    _super.protected.removeHandler(ASJS.Stage.RESIZE, onResize);

    _super.protected.view.destruct();
    _container.destruct();

    destructClass(_container);
    destructClass(_super.protected.view);

    _container = null;
    _super.protected.view = null;

    _super.destruct();
  }

  _super.protected.show = function() {
    if (!_super.protected.isViewAttached) {
      _container.addChild(_super.protected.view);
      _super.protected.render();
    }
  }

  _super.protected.hide = function() {
    _super.protected.isViewAttached && _container.removeChild(_super.protected.view);
  }

  function onResize() {
    _super.protected.render();
  }

  _super.protected.render = function() {
    _super.protected.isViewAttached && _super.protected.view.render();
  }
});
