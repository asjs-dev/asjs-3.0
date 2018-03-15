require("../../../../../common/js/utils/dataUtils/Language.js");
require("../../../../../common/js/view/AbstractView.js");
require("../ContentMediator.js");

var ContentView = createClass(
"ContentView",
AbstractView,
function(_scope, _super) {
  var _language = Language.instance;
  var _parent;

  var _background = new ASJS.DisplayObject();

  _scope.new = function() {
    _super.new();
    _scope.addClass("external-content-view");
    _scope.addEventListener(ASJS.Stage.ADDED_TO_STAGE, addedToStage);
    _scope.addEventListener(ASJS.Stage.REMOVED_FROM_STAGE, removedFromStage);

    _background.addClass("background");
    _scope.addChild(_background);

    _scope.render();
  }

  _scope.render = function() {
    if (!_parent) return;
    _background.setSize(_parent.width, _parent.height);
  }

  function addedToStage() {
    _parent = _scope.parent.parent;
  }

  function removedFromStage() {
    _parent = null;
  }
});
