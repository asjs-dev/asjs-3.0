require("../asjs.DisplayObject.js");
require("./asjs.FormElement.js");

createClass(ASJS, "RadioButton", ASJS.FormElement, function(_scope, _super) {
  var _radio = new ASJS.DisplayObject("input");
  var _label = new ASJS.DisplayObject();

  override(_scope, _super, "new");
  _scope.new = function() {
    _super.new("label");
    _radio.setAttr("type", "radio");
    _radio.visible = false;
    _scope.addChild(_radio);

    _label.setSize("100%", "100%");
    _label.enabled = false;
    _scope.addChild(_label);
  }

  get(_scope, "radio", function() { return _radio; });

  override(_scope, _super, "enabled");
  set(_scope, "enabled", function(v) { _super.enabled = _radio.enabled = v; });

  prop(_scope, "name", {
    get: function() { return _radio.getAttr("name"); },
    set: function(v) { _radio.setAttr("name", v); }
  });

  prop(_scope, "checked", {
    get: function() { return _radio.el.checked; },
    set: function(v) {
      _radio.el.checked = v;
      v && _radio.el.change();
    }
  });

  prop(_scope, "val", {
    get: function() { return _radio.value; },
    set: function(v) { _radio.value = v; }
  });

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _radio.destruct();
    _label.destruct();

    _radio =
    _label = null;

    _super.destruct();
  }
});
