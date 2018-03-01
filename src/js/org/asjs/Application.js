ASJS.sourcePath("./");

ASJS.import("org/asjs/controller/StartupCommand.js");

var Application = createClass(
"Application",
ASJS.Sprite,
function(_scope, _super) {
  _scope.new = function() {
    _super.new();
    trace("<AS/JS> Application 3.0.1.{{version}}");
    (new StartupCommand()).execute(_scope);
  }
});
// -------------------- //
ASJS.start(Application);
