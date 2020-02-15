var stage;
cnst(this, "ASJS", (function() {
  var _scope = {};

  trace("<AS/JS> core version: {{appVersion}}.{{date}}");

  _scope.start = function(application, root) {
    ASJS.Polyfill.instance;
    if (!stage) {
      stage = ASJS.Stage.instance;
      stage.clear();
    }

    var parent = stage;
    if (root) {
      if (is(root, ASJS.Sprite)) parent = root;
      if (is(root, Element)) parent = new ASJS.Sprite(root);
    }

    isDocumentComplete()
    ? start(application, parent)
    : document.addEventListener(ASJS.DocumentEvent.READY_STATE_CHANGE, function listener() {
        isDocumentComplete() && start(application, parent) && document.removeEventListener(ASJS.DocumentEvent.READY_STATE_CHANGE, listener);
      });
  }

  function start(application, root) {
    try {
      var app = new application();
      is(app, ASJS.Tag) && root.addChild(app);
    } catch (e) {
      trace(e);
    }
    return application;
  }

  return _scope;
})());

cnst(window, "on",     "addEventListener");
cnst(window, "off",    "removeEventListener");
cnst(window, "offAll", "removeEventListeners");
cnst(window, "de",     "dispatchEvent");
cnst(window, "has",    "hasEventListener");

var stage;

c1(ASJS, "Importer", Object, function(_scope) {
  var _priv = {};
  cnst(_priv, "REQUIRE_REGEX", /require\((\"[^\"]*\"|\'[^\']*\')\)\;/gm);

  var _version = Date.now();

  var _sourcePath     = "";
  var _includedScript = [];

  _scope.sourcePath = function(v) {
    _sourcePath = v;
  }

  _scope.require = function(fileName, basePath, autoRequire, compressed) {
    var dfd = new ASJS.Promise();

    basePath = basePath || document.baseURI + _sourcePath;
    var path = getPath(basePath, fileName);

    if (_includedScript.indexOf(path) > -1) dfd.resolve();
    else {
      _includedScript.push(path);
      var loader = new ASJS.Loader();
          loader.compressed = compressed;
          loader.load(path + "?" + _version).then(function() {
            searchRequires(loader).finally(function(content) {
              loader.destruct();
              loader = null;
              dfd.resolve(content);
              if (!autoRequire) Function(content)();
            });
          });
    }

    return dfd;
  }

  function getPath(baseUrl, filePath) {
    var fileName     = filePath.substr(filePath.lastIndexOf("/") + 1);
    var relativePath = filePath.substr(0, filePath.lastIndexOf("/"));
    var absolutePath = resolvePath(baseUrl, relativePath);
    return [absolutePath, fileName].join("/");
  }

  function searchRequires(loader) {
    var dfd = new ASJS.Promise();

    var script = "";
    var url     = loader.url;
    var content = loader.content;
    var baseURL = url.substr(0, url.lastIndexOf("/"));
    var m;
    var requires = [];
    while ((m = _priv.REQUIRE_REGEX.exec(content)) !== null) requires.push(m);

    ito(requires, function(index, value, next, end) {
      var path = value[1].substr(1, value[1].length - 2);
      content = content.replace(value[0], "");
      require(path, baseURL, true).finally(function(importedContent) {
        script += importedContent;
        next();
      });
    }, function() {
      dfd.resolve(script + content);
    });

    return dfd;
  }

  return _scope;
});

var sourcePath = ASJS.Importer.instance.sourcePath;
var require    = ASJS.Importer.instance.require;

c0(ASJS, "BaseClass", Object, function(_scope, _super) {
  _scope.new       = function() {};
  _scope.protected = {};
  _scope.prot      = _scope.protected;
  _scope.destruct  = function() {
    destObj(_scope);
    destObj(_super);
    _scope = null;
    _super = null;
  }
  _scope.toObject  = function() {
    return JSON.parse(JSON.stringify(_scope));
  }
});
