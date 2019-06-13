require("./asjs.Loader.js");

createClass(ASJS, "ScriptLoader", ASJS.Loader, function(_scope, _super) {
  var _content;

  get(_scope, "rawContent", function() { return _super.content; });

  get(_scope, "content", function() {
    if (!_content && _super.content !== "") {
      _content = Function((_super.content.indexOf("(function()") === 0 ? "return" : "") + _super.content)();
      _scope.free();
    }
    return _content;
  });

  _scope.unload = function() {
    _content = null;
    _super.unload();
  }

  _scope.load = function(url) {
    _scope.unload();
    _super.load(url);
  }

  _scope.destruct = function() {
    _content = null;
    _super.destruct();
  }
});
