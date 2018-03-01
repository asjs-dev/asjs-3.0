ASJS.import("com/asjs/event/asjs.EventDispatcher.js");
ASJS.import("com/asjs/event/asjs.WindowEvent.js");

ASJS.Window = createSingletonClass(
"Window",
ASJS.EventDispatcher,
function(_scope) {
  var _browserStatus;
  
  var _el = window;

  _scope.new = function() {
    _browserStatus = navigator.onLine ? ASJS.WindowEvent.ONLINE : ASJS.WindowEvent.OFFLINE;
    _scope.addEventListener(ASJS.WindowEvent.ONLINE + " " + ASJS.WindowEvent.OFFLINE, function(e) {
      _browserStatus = e.type;
    });
  }

  get(_scope, "isOnline", function() { return _browserStatus === ASJS.WindowEvent.ONLINE; });

  get(_scope, "width", function() { return document.documentElement.clientWidth || document.body.clientWidth || _el.innerWidth; });

  get(_scope, "height", function() { return document.documentElement.clientHeight || document.body.clientHeight || _el.innerHeight; });

  get(_scope, "screenTop", function() { return _el.screen.availTop; });

  get(_scope, "screenLeft", function() { return _el.screen.availLeft; });

  get(_scope, "screenWidth", function() { return _el.screen.width; });

  get(_scope, "screenHeight", function() { return _el.screen.height; });

  get(_scope, "screenAvailWidth", function() { return _el.screen.availWidth; });

  get(_scope, "screenAvailHeight", function() { return _el.screen.availHeight; });

  prop(_scope, "scrollTop", {
    get: function() { return (!empty(_el.pageYOffset) ? _el.pageYOffset : document.scrollTop) - (document.clientTop || 0); },
    set: function(v) { _el.scrollTo(_scope.scrollLeft, v); }
  });

  prop(_scope, "scrollLeft", {
    get: function() { return (!empty(_el.pageXOffset) ? _el.pageXOffset : document.scrollLeft) - (document.clientLeft || 0); },
    set: function(v) { _el.scrollTo(v, _scope.scrollTop); }
  });
});
