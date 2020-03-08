require("../../../common/js/controller/command/LoadStartupDataCommand.js");
require("./startup/EnvironmentCommand.js");
require("./startup/ViewPrepCommand.js");

createClass(NS, "StartupCommand", ASJS.AbstractCommand, function(_scope) {
  _scope.execute = function(app) {
    (new ASJSUtils.LoadStartupDataCommand()).execute()
      .then(initApplication.bind(_scope, app));
  }

  function initApplication(app) {
    (new NS.EnvironmentCommand()).execute();
    (new NS.ViewPrepCommand()).execute(app);

    _scope.destruct();
  }
});
