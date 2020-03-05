require("../../utils/dataUtils/Language.js");
require("../../utils/dataUtils/Config.js");
require("../service/LoadJSONServiceCommand.js");

createClass(ASJSUtils, "LoadStartupDataCommand", ASJS.AbstractCommand, function(_scope, _super) {
  var _dfd;

  _scope.new = function() {
    _dfd = new ASJS.Promise();
  }

  _scope.execute = function() {
    loadConfig();
    return _dfd;
  }

  _scope.destruct = function() {
    _dfd.destruct();
    _dfd = null;

    _super.destruct();
  }

  function loadConfig() {
    loadJSON("config.dat", function(response) {
      ASJSUtils.Config.instance.data = response;
      loadLanguage();
    });
  }

  function loadLanguage() {
    loadJSON("language.dat", function(response) {
      ASJSUtils.Language.instance.data = response;
      loadComplete();
    });
  }

  function loadComplete() {
    _dfd.resolve();
    _scope.destruct();
  }

  function loadJSON(url, callback) {
    (new ASJSUtils.LoadJSONServiceCommand()).execute("data/" + url)
      .then(callback)
      .catch(onLoadError);
  }

  function onLoadError(data) {
    _dfd.reject();
    _scope.destruct();
    throw new Error("JSON load error");
  }
});
