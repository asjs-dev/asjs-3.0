ASJS.import("com/commons/dataUtils/Language.js");
ASJS.import("org/asjs/module/content/ContentMediator.js");

var Box = createClass(
"Box",
ASJS.Sprite,
function(_scope, _super) {
  var _language = Language.instance;
  var _label    = new ASJS.Label();
  var _button   = new ASJS.Button();
  
  _scope.new = function() {
    _super.new();
    _scope.addClass("box");
    
    _label.text = _language.getText("new_asjs_base_site");
    _label.addClass("label");
    _scope.addChild(_label);

    _button.label = _language.getText("show_notification_window");
    _button.addClass("button show-notification-button");
    
    _button.addEventListener(ASJS.MouseEvent.CLICK, onButtonClick);
    _scope.addChild(_button);
  }
  
  get(_scope, "label", function() { return _label; });
  
  function onButtonClick() {
    _scope.dispatchEvent(ContentMediator.ON_SHOW_NOTIFICATION_WINDOW);
  }
});
