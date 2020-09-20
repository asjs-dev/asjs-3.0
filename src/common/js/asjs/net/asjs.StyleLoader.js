require("../display/asjs.Head.js");
require("../display/asjs.Tag.js");
require("./asjs.Loader.js");

helpers.createClass(ASJS, "StyleLoader", ASJS.Loader, function(_scope, _super) {
  var _head = ASJS.Head.instance;
  var _style;

  helpers.override(_scope, _super, "content");
  _scope.useStyle = function() {
    if (_style || _super.content === "") return;
    _style = new ASJS.Tag("style");
    _style.setAttr("type", "text/css");
    _style.text = _super.content;
    _head.addChild(_style);
  }

  helpers.override(_scope, _super, "unload");
  _scope.unload = function() {
    _style && _head.contains(_style) && _head.removeChild(_style);
    _style = null;
    _super.unload();
  }

  helpers.override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _head  =
    _style = null;

    _super.destruct();
  }
});
