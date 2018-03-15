require("./asjs.Loader.js");

ASJS.ScriptLoader = createClass(
"ScriptLoader",
ASJS.Loader,
function(_scope, _super) {
  var _content;

  get(_scope, "content", function() {
    if (!_content && _super.content !== "") {
      _content = getScript();
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

  function getScript() {
    try {
      return Function(_super.content)();
    } catch (e) {
      trace("The external script must be wrapped");
    }
  }
});
