require("../event/asjs.MouseEvent.js");
require("../geom/asjs.Point.js");

ASJS.Mouse = createSingletonClass(
"Mouse",
ASJS.BaseClass,
function(_scope) {
  var _mousePos = new ASJS.Point();

  get(_scope, "mouseX", function() { return _mousePos.x; });

  get(_scope, "mouseY", function() { return _mousePos.y; });
  
  _scope.show = function() {
    stage.setCSS("cursor", "default");
  };

  _scope.hide = function() {
    stage.setCSS("cursor", "none");
  };

  _scope.getRelativePosition = function(target) {
    return target.globalToLocal(_mousePos);
  };

  _scope.init = function() {
    window.addEventListener(ASJS.MouseEvent.MOUSE_MOVE, onMouseMove);
    window.addEventListener(ASJS.MouseEvent.TOUCH_MOVE, onMouseMove);
  };
  
  function onMouseMove(e) {
    var iosTouchEvent = e.touches;
    var androidTouchEvent = e.originalEvent ? e.originalEvent.touches : null;
    var touches = iosTouchEvent || androidTouchEvent;
    var touch = e;
    if (touches && touches.length > 0) touch = touches[0];
    _mousePos.x = touch.pageX;
    _mousePos.y = touch.pageY;
  };
});
