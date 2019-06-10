require("../../../common/js/utils/dataUtils/Language.js");
require("../../../common/js/utils/dataUtils/Config.js");
require("../../../common/js/controller/service/LoadJSONServiceCommand.js");
require("./startup/EnvironmentCommand.js");
require("./startup/ViewPrepCommand.js");

createClass(NS, "StartupCommand", ASJS.AbstractCommand, function(_scope) {
  var _app;

  _scope.execute = function(app) {
    _app = app;
    loadConfig();
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
      initApplication();
    });
  }

  function initApplication() {
    (new NS.EnvironmentCommand()).execute();
    (new NS.ViewPrepCommand()).execute(_app);
  }

  function loadJSON(url, callback) {
    (new ASJSUtils.LoadJSONServiceCommand())
      .execute("external/data/" + url)
      .then(callback)
      .catch(onLoadError);
  }

  function onLoadError(data) {
    throw new Error("JSON load error");
  }
});
