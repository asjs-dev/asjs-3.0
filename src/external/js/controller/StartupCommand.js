require("../../../common/js/utils/dataUtils/Config.js");
require("../../../common/js/utils/dataUtils/Language.js");
require("./startup/EnvironmentCommand.js");
require("./startup/ViewPrepCommand.js");
require("../../../common/js/controller/service/LoadJSONServiceCommand.js");

var StartupCommand = createClass(
"StartupCommand",
ASJS.AbstractCommand,
function(_scope) {
  var _app;

  _scope.execute = function(app) {
    _app = app;
    loadConfig();
  }

  function loadConfig() {
    loadJSON("config.dat", function(response) {
      Config.instance.data = response;
      loadLanguage();
    });
  }

  function loadLanguage() {
    loadJSON("language.dat", function(response) {
      Language.instance.data = response;
      initApplication();
    });
  }

  function initApplication() {
    (new EnvironmentCommand()).execute();
    (new ViewPrepCommand()).execute(_app);
  }

  function loadJSON(url, callback) {
    (new LoadJSONServiceCommand())
      .execute("external/data/" + url)
      .then(callback)
      .catch(onLoadError);
  }

  function onLoadError(data) {
    throw new Error("JSON load error");
  }
});
