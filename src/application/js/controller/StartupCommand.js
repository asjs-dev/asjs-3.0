require("../../../common/js/helpers/createClass.js");
require("../../../common/js/utils/controller/command/LoadStartupDataCommand.js");

require("../NameSpace.js");
require("./startup/EnvironmentCommand.js");
require("./startup/ViewPrepCommand.js");

helpers.createClass(NS, "StartupCommand", ASJS.AbstractCommand, function(_scope) {
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
