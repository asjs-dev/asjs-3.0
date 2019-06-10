require("./NameSpace.js");
require("./controller/StartupCommand.js");

createClass(NS, "Application", ASJS.Sprite, function(_scope, _super) {
  _scope.new = function() {
    _super.new();
    trace("<AS/JS> Application {{appVersion}}.{{date}}");
    (new NS.StartupCommand()).execute(_scope);
  }
});
// -------------------- //
ASJS.start(NS.Application);
