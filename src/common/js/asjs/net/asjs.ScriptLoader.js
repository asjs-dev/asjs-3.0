require("net/asjs.Loader.js");

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

  function getPreparateScript() {
    var regex = /ASJS\.start\(([ a-zA-Z0-9]*)\)/g;
    var m = regex.exec(_super.content);
    if (m) return _super.content.split(m[0]).join("return " + m[1]);
    return _super.content.split("ASJS.start(").join("return ASJS.start(");
  }

  function getScript() {
    try {
      return Function("return " + getPreparateScript())();
    } catch (e) {
      trace("The external script must be wrapped");
    }
  }
});
