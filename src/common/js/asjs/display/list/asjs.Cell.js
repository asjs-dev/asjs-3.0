require("../../event/asjs.MouseEvent.js");
require("../asjs.Sprite.js");

helpers.createClass(ASJS, "Cell", ASJS.Sprite, function(_scope, _super) {
  var _data    = {};
  var _checked = false;

  helpers.override(_scope, _super, "new");
  _scope.new = function() {
    _super.new("li");
    _scope.setCSS("position", "relative");
    _scope.mouseChildren = false;
    _scope.addEventListener(ASJS.MouseEvent.CLICK, onClick);
  }

  ASJS.Tag.attrProp(_scope, "name");

  helpers.property(_scope, "checked", {
    get: function() { return _checked; },
    set: function(v) { _checked = v; }
  });

  helpers.property(_scope, "data", {
    get: function() { return _data; },
    set: function(v) {
      _data = v;
      if (_data.id) _scope.id = _data.id;
      _scope.showData();
    }
  });

  _scope.render = function() {}

  _scope.showData = function() {}

  helpers.override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _data    =
    _checked = null;

    _super.destruct();
  }

  function onClick(e) {
    _scope.dispatchEvent(ASJS.Cell.CLICK, {
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey
    });
  }
});
helpers.message(ASJS.Cell, "CLICK");
