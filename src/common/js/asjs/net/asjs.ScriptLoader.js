require("./asjs.Loader.js");

createClass(ASJS, "ScriptLoader", ASJS.Loader, function(_scope, _super) {
  var _content;
  var _beforeRunScript;
  
  prop(_scope, "beforeRunScript", {
    get: function() { return _beforeRunScript; },
    set: function(v) { _beforeRunScript = v; }
  });

  get(_scope, "content", function() {
    if (!_content && _super.content !== "") {
      var content = replaceRequire(tis(_beforeRunScript, "function") ? _beforeRunScript(_super.content) : _super.content);
      _content = Function((content.indexOf("(function()") === 0 ? "return" : "") + content)();
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

  function replaceRequire(content) {
    var regex = /require\((\"[^\"]*\"|\'[^\']*\')\)\;/gm;
    var baseUrl = _scope.url.substr(0, _scope.url.lastIndexOf("/"));
    var m;
    while ((m = regex.exec(content)) !== null) {
        if (m.index === regex.lastIndex) regex.lastIndex++;
        var path = m[1].substr(1, m[1].length - 1);
        var fileName = path.substr(path.lastIndexOf("/") + 1);
        var relativePath = path.substr(0, path.lastIndexOf("/"));
        content = content.replace(m[1], "\"" + convertRelativePathToAbsolute(baseUrl, path));
    }
    return content;
  }
});
