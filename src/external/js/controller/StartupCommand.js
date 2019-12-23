require("../../../common/js/controller/command/LoadStartupDataCommand.js");
require("./startup/EnvironmentCommand.js");
require("./startup/ViewPrepCommand.js");

createClass(NS, "StartupCommand", ASJS.AbstractCommand, function(_scope) {
  var _app;

  _scope.execute = function(app) {
    _app = app;

    (new ASJSUtils.LoadStartupDataCommand()).execute()
      .then(initApplication);
  }

  function initApplication() {
    (new NS.EnvironmentCommand()).execute();
    (new NS.ViewPrepCommand()).execute(_app);

    _scope.destruct();
  }
});
