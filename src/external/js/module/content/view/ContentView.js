require("../../../../../common/js/view/AbstractView.js");
require("../../../../../common/js/utils/dataUtils/Language.js");
require("../ContentMediator.js");

createClass(NS, "ContentView", ASJSUtils.AbstractView, function(_scope, _super) {
  var _language = ASJSUtils.Language.instance;
  var _parent;

  var _background = new ASJS.DisplayObject();

  _scope.new = function() {
    _super.new();
    _scope.addClass("external-content-view");
    _scope.addEventListener(ASJS.Stage.ADDED_TO_STAGE,     addedToStage);
    _scope.addEventListener(ASJS.Stage.REMOVED_FROM_STAGE, removedFromStage);

    _background.addClass("background");
    _scope.addChild(_background);
  }

  _scope.render = function() {
    if (!_parent) return;
    _background.setSize(_parent.width, _parent.height);
  }

  _scope.destruct = function() {
    _scope.clear();

    _background.destruct();
    _background = null;

    _super.destruct();
  }

  function addedToStage() {
    _parent = _scope.parent.parent;
  }

  function removedFromStage() {
    _parent = null;
  }
});
