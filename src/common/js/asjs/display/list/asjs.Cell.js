require("../../event/asjs.MouseEvent.js");
require("../asjs.Sprite.js");

createClass(ASJS, "Cell", ASJS.Sprite, function(_scope, _super) {
  var _data    = {};
  var _checked = false;

  _scope.new = function() {
    _super.new("li");
    _scope.setCSS("position", "relative");
    _scope.mouseChildren = false;
    _scope.addEventListener(ASJS.MouseEvent.CLICK, onClick);
  }

  ASJS.Tag.attrProp(_scope, "name");

  prop(_scope, "checked", {
    get: function() { return _checked; },
    set: function(v) { _checked = v; }
  });

  prop(_scope, "data", {
    get: function() { return _data; },
    set: function(v) {
      _data = v;
      if (_data.id) _scope.id = _data.id;
      _scope.showData();
    }
  });

  _scope.render = function() {}

  _scope.showData = function() {}

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
msg(ASJS.Cell, "CLICK");
