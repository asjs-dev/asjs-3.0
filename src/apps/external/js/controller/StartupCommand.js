require("../../../com/dataUtils/Config.js");
require("../../../com/dataUtils/Language.js");
require("./startup/EnvironmentCommand.js");
require("./startup/ViewPrepCommand.js");
require("../../../application/js/controller/service/LoadJSONServiceCommand.js");

var StartupCommand = createClass(
"StartupCommand",
ASJS.AbstractCommand,
function(_scope) {
  var priv = {};
  
  cnst(priv, "JSON_PATH", "external/data/");
  
  var _config   = Config.instance;
  var _language = Language.instance;
  var _app;
  
  _scope.execute = function(app) {
    _app = app;
    loadConfig();
  }
  
  function loadJSON(url, callback) {
    (new LoadJSONServiceCommand())
      .execute(url)
      .then(callback)
      .catch(onLoadError);
  }
  
  function loadConfig() {
    loadJSON(priv.JSON_PATH + "config.dat", function(response) {
      _config.data = response;
      loadLanguage();
    });
  }

  function loadLanguage() {
    loadJSON(priv.JSON_PATH + "language.dat", function(response) {
      _language.data = response;
      initApplication();
    });
  }

  function initApplication() {
    (new EnvironmentCommand()).execute();
    (new ViewPrepCommand()).execute(_app);
  }
  
  function onLoadError(data) {
    throw new Error("JSON load error");
  }
});
