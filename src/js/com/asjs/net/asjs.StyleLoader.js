ASJS.import("com/asjs/net/asjs.Loader.js");
ASJS.import("com/asjs/display/asjs.Head.js");
ASJS.import("com/asjs/display/asjs.Tag.js");

ASJS.StyleLoader = createClass(
"StyleLoader",
ASJS.Loader,
function(_scope, _super) {
  var _head = ASJS.Head.instance;
  var _style;

  _scope.useStyle = function() {
    if (_style || _super.content === "") return;
    _style = new ASJS.Tag("style");
    _style.setAttr("type", "text/css");
    _style.text = _super.content;
    _head.addChild(_style);
    _scope.free();
  }

  _scope.unload = function() {
    if (_style && _head.contains(_style)) _head.removeChild(_style);
    _style = null;
    _super.unload();
  }

  _scope.load = function(url) {
    _scope.unload();
    _super.load(url);
  }
});
