require("../../../../../common/js/view/AbstractAnimatedView.js");
require("../../../../../common/js/utils/dataUtils/Language.js");
require("../ContentMediator.js");

createClass(NS, "ContentView", ASJSUtils.AbstractAnimatedView, function(_scope, _super) {
  var _language = ASJSUtils.Language.instance;
  var _parent;

  var _background = new ASJS.DisplayObject();

  override(_scope, _super, "new");
  _scope.new = function() {
    _super.new();

    _scope.addClass("external-content-view");
    _scope.addEventListener(ASJS.Stage.ADDED_TO_STAGE,     addedToStage);
    _scope.addEventListener(ASJS.Stage.REMOVED_FROM_STAGE, removedFromStage);

    _background.addClass("background");
    _scope.addChild(_background);
  }

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _scope.clear();

    _background.destruct();
    _background = null;

    _super.destruct();
  }

  function addedToStage(event) {
    if (event.target !== _scope.el) return;
    _parent = _scope.parent.parent;
  }

  function removedFromStage(event) {
    if (event.target !== _scope.el) return;
    _parent = null;
  }
});
