require("../../../../../../common/js/utils/dataUtils/Language.js");
require("../../ContentMediator.js");

createClass(NS, "Box", ASJS.Sprite, function(_scope, _super) {
  var _language = ASJSUtils.Language.instance;
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
    _scope.dispatchEvent(NS.ContentMediator.ON_SHOW_NOTIFICATION_WINDOW);
  }
});
