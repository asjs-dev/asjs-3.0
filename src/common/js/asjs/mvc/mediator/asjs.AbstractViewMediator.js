require("../../display/asjs.Sprite.js");
require("./asjs.AbstractMediator.js");

helpers.createClass(ASJS, "AbstractViewMediator", ASJS.AbstractMediator, function(_scope, _super) {
  var _container = new ASJS.Sprite();

  helpers.get(_super.protected, "isViewAttached", function() { return _container.contains(_super.protected.view); });
  helpers.get(_super.protected, "viewContainer", function() { return _container; });

  _scope.new = function(root) {
    _container.enabled = false;
    _container.setSize("100%", "100%");

    root.addChild(_container);

    _super.protected.addHandler(ASJS.Stage.RESIZE, onResize);
  }

  helpers.override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _super.protected.removeHandler(ASJS.Stage.RESIZE, onResize);

    _super.protected.view.destruct();
    _container.destruct();

    helpers.destructClass(_container);
    helpers.destructClass(_super.protected.view);

    _container            =
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

  _super.protected.render = function() {
    _super.protected.isViewAttached && _super.protected.view.render();
  }

  var onResize = _super.protected.render;
});
