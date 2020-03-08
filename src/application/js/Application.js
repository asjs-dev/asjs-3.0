require("./NameSpace.js");
require("./controller/StartupCommand.js");

createClass(NS, "Application", ASJS.BaseClass, function(_scope) {
  _scope.new = function() {
    stage.clear();

    trace("<AS/JS> Application {{appVersion}}.{{date}}");

    (new NS.StartupCommand()).execute(stage);
  }
});

ASJS.start(NS.Application);
