require("../../common/js/helpers/createClass.js");
require("../../common/js/helpers/BaseClass.js");

require("./NameSpace.js");
require("./controller/StartupCommand.js");

helpers.createClass(NS, "Application", helpers.BaseClass, function(_scope) {
  _scope.new = function() {
    stage.clear();

    console.log("<AS/JS> Application {{appVersion}}.{{date}}");

    (new NS.StartupCommand()).execute(stage);
  }
});

ASJS.start(NS.Application);
