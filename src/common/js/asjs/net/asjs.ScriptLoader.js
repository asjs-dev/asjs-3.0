require("./asjs.Loader.js");

createClass(ASJS, "ScriptLoader", ASJS.Loader, function(_scope, _super) {
  var _content;

  override(_scope, _super, "content");
  get(_scope, "rawContent", function() { return _super.content; });

  get(_scope, "content", function() {
    if (!_content && _super.content !== "")
      _content = Function((_super.content.indexOf("(function()") === 0 ? "return" : "") + _super.content)();
    return _content;
  });

  override(_scope, _super, "unload");
  _scope.unload = function() {
    _content = null;
    _super.unload();
  }

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _content = null;
    _super.destruct();
  }
});
