require("../asjs.Sprite.js");
require("./asjs.FormElement.js");

helpers.createClass(ASJS, "DropDown", ASJS.FormElement, function(_scope, _super) {
  var _select = new ASJS.Sprite("select");

  helpers.override(_scope, _super, "new");
  _scope.new = function() {
    _super.new();
    _scope.setCSS("overflow", "hidden");
    _scope.addChild(_select);
  }

  helpers.get(_scope, "select", function() { return _select; });

  helpers.override(_scope, _super, "enabled");
  helpers.set(_scope, "enabled", function(v) {
    _super.enabled = _select.enabled = v;
    _scope.render();
  });

  helpers.property(_scope, "name", {
    get: _select.getAttr.bind(_select, "name"),
    set: _select.setAttr.bind(_select, "name")
  });

  helpers.property(_scope, "val", {
    get: function() { return _select.el.value; },
    set: function(v) { _select.el.value = v; }
  });

  _scope.clearOptions = _select.clear;

  _scope.setOptions = function(options) {
    _scope.clearOptions();
    var i = options.length;
    while (i--) _scope.addOptionAt(options[i], 0);
  }

  _scope.addOption = _select.addChild;
  _scope.addOptionAt = _select.addChildAt;

  _scope.render = function() {
    _select.setSize(_scope.width + 30, _scope.height);
  }

  helpers.override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _select.destruct();
    _select = null;

    _super.destruct();
  }
});
