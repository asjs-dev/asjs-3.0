require("../asjs.Sprite.js");
require("./asjs.FormElement.js");

createClass(ASJS, "DropDown", ASJS.FormElement, function(_scope, _super) {
  var _select = new ASJS.Sprite("select");

  _scope.new = function() {
    _super.new();
    _scope.setCSS("overflow", "hidden");
    _scope.addChild(_select);
  }

  get(_scope, "select", function() { return _select; });

  set(_scope, "enabled", function(v) {
    _super.enabled = _select.enabled = v;
    _scope.render();
  });

  prop(_scope, "name", {
    get: function() { return _select.getAttr("name"); },
    set: function(v) { _select.setAttr("name", v); }
  });

  prop(_scope, "val", {
    get: function() { return _select.el.value; },
    set: function(v) { _select.el.value = v; }
  });

  _scope.clearOptions = _select.clear;

  _scope.setOptions = function(options) {
    _scope.clearOptions();
    var i = -1;
    var l = options.length;
    while (++i < l) _scope.addOption(options[ i ]);
  }

  _scope.addOption = _select.addChild;

  _scope.render = function() {
    _select.setSize(_scope.width + 30, _scope.height);
  }

  _scope.destruct = function() {
    _select.destruct();
    _select = null;

    _super.destruct();
  }
});
