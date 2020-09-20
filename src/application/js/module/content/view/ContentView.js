require("../../../../../common/js/helpers/createClass.js");
require("../../../../../common/js/utils/dataUtils/Language.js");
require("../../../../../common/js/utils/view/AbstractAnimatedView.js");

require("../../../NameSpace.js");
require("../ContentMediator.js");
require("./assets/Box.js");

helpers.createClass(NS, "ContentView", ASJSUtils.AbstractAnimatedView, function(_scope, _super) {
  var _language                  = ASJSUtils.Language.instance;
  var _mouse                     = ASJS.Mouse.instance;
  var _background                = new ASJS.DisplayObject();
  var _box                       = new NS.Box();
  var _externalApplicationButton = new ASJS.Button();
  var _blurFilter                = new ASJS.BlurFilter();

  helpers.override(_scope, _super, "new");
  _scope.new = function() {
    _super.new();

    _scope.addClass("content-view");
    _scope.addEventListener(ASJS.Stage.ADDED_TO_STAGE, addedToStage);
    _scope.addEventListener(ASJS.Stage.REMOVED_FROM_STAGE, removedFromStage);

    _background.addClass("background");
    _scope.addChild(_background);

    _scope.addChild(_box);

    _externalApplicationButton.label = _language.getText("show_external_application_button_label");
    _externalApplicationButton.addClass("button show-external-application-button");
    _externalApplicationButton.addEventListener(ASJS.MouseEvent.CLICK, onExternalApplicationButtonClick);
    _scope.addChild(_externalApplicationButton);
  }

  function addedToStage(event) {
    if (event.target !== _scope.el) return;

    stage.addEventListener(ASJS.MouseEvent.MOUSE_MOVE + " " + ASJS.MouseEvent.TOUCH_MOVE, onStageMouseMove);

    _scope.addEventListener(ASJS.MouseEvent.CLICK, onMouseClick);
  }

  function removedFromStage() {
    stage.removeEventListener([ASJS.MouseEvent.MOUSE_MOVE, ASJS.MouseEvent.TOUCH_MOVE], onStageMouseMove);

    _scope.removeEventListener(ASJS.MouseEvent.CLICK, onMouseClick);
  }

  function onStageMouseMove() {
    _blurFilter.value = (Math.max(0, stage.stageHeight / (stage.stageHeight - _mouse.mouseY)) / 10);
    _background.filters = [_blurFilter];
  }

  function onMouseClick() {
    var hitTest = _box.hitTest(ASJS.Point.create(_mouse.mouseX, _mouse.mouseY));
    _box.label.text = _language.getText(hitTest ? "hit_test_inside" : "hit_test_outside");
  }

  function onExternalApplicationButtonClick() {
    _scope.dispatchEvent(NS.ContentMediator.ON_SHOW_EXTERNAL_APPLICATION);
  }
});
