require("../event/asjs.WindowEvent.js");
require("../utils/asjs.Mouse.js");
require("./asjs.Window.js");
require("./asjs.Sprite.js");

ASJS.Stage = createSingletonClass(
"Stage",
ASJS.Sprite,
function(_scope, _super) {
  var _window      = ASJS.Window.instance;
  var _stageWidth  = 0;
  var _stageHeight = 0;

  _scope.new = function() {
    _super.new(document.body);
    _scope.setSize("100%", "100%");
    window.addEventListener(ASJS.WindowEvent.RESIZE, recalcStageSize);
    recalcStageSize();

    ASJS.Mouse.instance.init();
  }

  get(_scope, "stage", function() { return _scope; });

  get(_scope, "stageWidth", function() { return _stageWidth; });

  get(_scope, "stageHeight", function() { return _stageHeight; });

  function recalcStageSize() {
    var overflowX = _scope.getCSS("overflow-x");
    var overflowY = _scope.getCSS("overflow-y");

    _scope.setCSS("overflow-x", "hidden");
    _scope.setCSS("overflow-y", "hidden");

    _stageWidth  = _window.width;
    _stageHeight = _window.height;

    _scope.setCSS("overflow-x", overflowX);
    _scope.setCSS("overflow-y", overflowY);

    _scope.dispatchEvent(ASJS.Stage.RESIZE);
  }
});
msg(ASJS.Stage, "RESIZE");
msg(ASJS.Stage, "ADDED_TO_STAGE");
msg(ASJS.Stage, "REMOVED_FROM_STAGE");
