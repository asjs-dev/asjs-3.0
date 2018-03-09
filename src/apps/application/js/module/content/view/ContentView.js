require("com/dataUtils/Language.js");
require("application/js/view/AbstractView.js");
require("application/js/module/content/ContentMediator.js");
require("application/js/module/content/view/assets/Box.js");

var ContentView = createClass(
"ContentView",
AbstractView,
function(_scope, _super) {
  var _language                  = Language.instance;
  var _mouse                     = ASJS.Mouse.instance;
  var _background                = new ASJS.DisplayObject();
  var _box                       = new Box();
  var _externalApplicationButton = new ASJS.Button();
  var _animatedSprite            = new ASJS.DisplayObject();
  var _drag                      = false;
  var _blurFilter                = new ASJS.BlurFilter();
  
  _scope.new = function() {
    _super.new();
    _scope.addClass("content-view");
    _scope.addEventListener(ASJS.Stage.ADDED_TO_STAGE, addedToStage);
    _scope.addEventListener(ASJS.Stage.REMOVED_FROM_STAGE, removedFromStage);
    
    _background.addClass("background");
    _background.setCSS("position", "fixed");
    _background.alpha = 0.5;
    _scope.addChild(_background);

    _scope.addChild(_box);

    _animatedSprite.move(10, 10);
    _scope.addChild(_animatedSprite);

    _animatedSprite.addEventListener(ASJS.MouseEvent.CLICK, onAnimatedSpriteClick);
    _animatedSprite.addEventListener(ASJS.MouseEvent.MOUSE_DOWN + " " + ASJS.MouseEvent.TOUCH_START, onAnimatedSpriteMouseDown);
    
    _externalApplicationButton.label = _language.getText("show_external_application_button_label");
    _externalApplicationButton.addClass("button show-external-application-button");
    _externalApplicationButton.addEventListener(ASJS.MouseEvent.CLICK, onExternalApplicationButtonClick);
    _scope.addChild(_externalApplicationButton);
    
    requestAnimationFrame(_scope.render);
  }
  
  _scope.render = function() {
    _background.setSize(stage.stageWidth, stage.stageHeight);
    _externalApplicationButton.x = _box.x = (stage.stageWidth - _box.width) * 0.5;
  }

  function addedToStage() {
    stage.addEventListener(ASJS.MouseEvent.MOUSE_UP + " " + ASJS.MouseEvent.TOUCH_END,    onDragStop);
    stage.addEventListener(ASJS.MouseEvent.MOUSE_LEAVE,                                   onDragStop);
    stage.addEventListener(ASJS.MouseEvent.MOUSE_MOVE + " " + ASJS.MouseEvent.TOUCH_MOVE, onStageMouseMove);

    _scope.addEventListener(ASJS.MouseEvent.CLICK, onMouseClick);
    
    playFireworksAnimation();
  }
  
  function removedFromStage() {
    stage.removeEventListener(ASJS.MouseEvent.MOUSE_UP + " " + ASJS.MouseEvent.TOUCH_END,    onDragStop);
    stage.removeEventListener(ASJS.MouseEvent.MOUSE_LEAVE,                                   onDragStop);
    stage.removeEventListener(ASJS.MouseEvent.MOUSE_MOVE + " " + ASJS.MouseEvent.TOUCH_MOVE, onStageMouseMove);

    _scope.removeEventListener(ASJS.MouseEvent.CLICK, onMouseClick);
  }

  function playExplodeAnimation() {
    if (!_animatedSprite) return;
    _animatedSprite.setSize(256, 128);
    _animatedSprite.removeClass("animation-fireworks");
    _animatedSprite.addClass("animation-explode");
  }

  function playFireworksAnimation() {
    if (!_animatedSprite) return;
    _animatedSprite.setSize(200, 200);
    _animatedSprite.removeClass("animation-explode");
    _animatedSprite.addClass("animation-fireworks");
  }

  function onAnimatedSpriteClick() {
    if (_animatedSprite.hasClass("animation-fireworks")) playExplodeAnimation();
    else playFireworksAnimation();
  }

  function onAnimatedSpriteMouseDown() {
    _drag = true;
  }

  function onDragStop() {
    _drag = false;
  }

  function onStageMouseMove() {
    _blurFilter.value = (Math.max(0, stage.stageHeight / (stage.stageHeight - _mouse.mouseY)) / 10);
    
    _background.filters = [_blurFilter];
    if (!_drag) return;
    _animatedSprite.move(_mouse.mouseX - _animatedSprite.width * 0.5, _mouse.mouseY - _animatedSprite.height * 0.5);
  }

  function onMouseClick() {
    var hitTest = _box.hitTest(new ASJS.Point(_mouse.mouseX, _mouse.mouseY));
    _box.label.text = _language.getText(hitTest ? "hit_test_inside" : "hit_test_outside");
  }
  
  function onExternalApplicationButtonClick() {
    _scope.dispatchEvent(ContentMediator.ON_SHOW_EXTERNAL_APPLICATION);
  }
});
