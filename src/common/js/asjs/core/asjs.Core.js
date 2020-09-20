helpers.constant(this, "ASJS", (function() {
  var _scope = {};

  console.log("<AS/JS> core version: {{appVersion}}.{{date}}");

  _scope.start = function(application, root) {
    helpers.isDocumentComplete()
      ? start(application, root)
      : document.addEventListener(ASJS.DocumentEvent.READY_STATE_CHANGE, function listener() {
          helpers.isDocumentComplete() &&
          start(application, root) &&
          document.removeEventListener(ASJS.DocumentEvent.READY_STATE_CHANGE, listener);
        });
  }

  function start(application, root) {
    ASJS.Stage.instance;

    var parent = stage;
    if (root) {
      if (helpers.is(root, ASJS.Sprite)) parent = root;
      if (helpers.is(root, Element)) parent = new ASJS.Sprite(root);
    }

    try {
      var app = new application();
      helpers.is(app, ASJS.Tag) && parent.addChild(app);
    } catch (e) {
      console.log(e);
    }
  }

  return _scope;
})());
window.ASJS = this.ASJS;

helpers.createSingletonClass(ASJS, "Importer", Object, function(_scope) {
  var priv = {};

  helpers.constant(priv, "REQUIRE_REGEX", /require\((\"[^\"]*\"|\'[^\']*\')\)\;/gm);

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
    if (_includedScript.indexOf(path) > -1) dfd.resolve("");
    else {
      _includedScript.push(path);
      var loader = new ASJS.Loader();
          loader.compressed = compressed;
          loader.responseType = "text/plain";
          loader.async = false;
          loader.load(path + "?" + _version).then(function() {
            searchRequires(loader).finally(function(content) {
              loader.destruct();
              loader = null;
              dfd.resolve(content);
              if (!autoRequire) {
                var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.innerHTML = content;
                document.body.appendChild(script);
              }
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

    var url     = loader.url;
    var content = loader.content;
    var baseUrl = url.substr(0, url.lastIndexOf("/"));
    var basePath = basePath || document.baseURI + _sourcePath;
    var m;
    var requires = [];
    while ((m = priv.REQUIRE_REGEX.exec(content)) !== null) requires.push(m);

    helpers.iterateOver(requires, function(index, value, next, end) {
      var path = value[1].substr(1, value[1].length - 2);

      require(path, baseUrl, true)
        .finally(function(importedContent) {
          content = content.replace(value[0], importedContent !== undefined
            ? importedContent
            : ""
          );
          next();
        });
    }, function() {
      dfd.resolve(content);
    });

    return dfd;
  }

  function resolvePath(basePath, path) {
    var basePathArray = basePath.split("/");
    helpers.isEmpty(basePathArray[basePathArray.length - 1]) && basePathArray.pop();
    var pathArray = path.split("/");
    helpers.isEmpty(pathArray[pathArray.length - 1]) && pathArray.pop();

    if ([".", ".."].indexOf(pathArray[0]) === -1) return path;

    var i = -1;
    var l = pathArray.length;
    while (++i < l) {
      if (pathArray[i] === "..") basePathArray.pop();
      else if (pathArray[i] !== ".") basePathArray.push(pathArray[i]);
    }

    return basePathArray.join("/");
  }

  return _scope;
});

var sourcePath = ASJS.Importer.instance.sourcePath;
var require    = ASJS.Importer.instance.require;
