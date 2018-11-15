require("./controller/StartupCommand.js");

var Application = createClass(
"Application",
ASJS.Sprite,
function(_scope, _super) {
  _scope.new = function() {
    _super.new();
    trace("<AS/JS> Application {{appVersion}}.{{date}}");
    (new StartupCommand()).execute(_scope);
  }
});
// -------------------- //
ASJS.start(Application);
