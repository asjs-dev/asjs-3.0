require("../../utils/dataUtils/Language.js");
require("../../utils/dataUtils/Config.js");
require("../service/LoadJSONServiceCommand.js");

createClass(ASJSUtils, "LoadStartupDataCommand", ASJS.AbstractCommand, function(_scope) {
  var _dfd;

  _scope.execute = function() {
    _dfd = new ASJS.Promise();

    loadConfig();

    return _dfd;
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
    throw new Error("JSON load error");
  }
});
