require("../event/asjs.EventDispatcher.js");
require("../event/asjs.WindowEvent.js");
require("../event/asjs.DocumentEvent.js");

helpers.createSingletonClass(ASJS, "Window", ASJS.EventDispatcher, function(_scope) {
  var _browserStatus;

  var _el = window;
  _scope.el = _el;

  _scope.new = function() {
    _browserStatus = navigator.onLine ? ASJS.WindowEvent.ONLINE : ASJS.WindowEvent.OFFLINE;
    _scope.addEventListener(ASJS.WindowEvent.ONLINE + " " + ASJS.WindowEvent.OFFLINE, function(e) {
      _browserStatus = e.type;
    });
  }

  helpers.get(_scope, "isOnline", function() { return _browserStatus === ASJS.WindowEvent.ONLINE; });

  helpers.get(_scope, "width", function() { return document.documentElement.clientWidth || document.body.clientWidth || _el.innerWidth; });

  helpers.get(_scope, "height", function() { return document.documentElement.clientHeight || document.body.clientHeight || _el.innerHeight; });

  helpers.get(_scope, "screenTop", function() { return _el.screen.availTop; });

  helpers.get(_scope, "screenLeft", function() { return _el.screen.availLeft; });

  helpers.get(_scope, "screenWidth", function() { return _el.screen.width; });

  helpers.get(_scope, "screenHeight", function() { return _el.screen.height; });

  helpers.get(_scope, "screenAvailWidth", function() { return _el.screen.availWidth; });

  helpers.get(_scope, "screenAvailHeight", function() { return _el.screen.availHeight; });

  helpers.property(_scope, "scrollTop", {
    get: function() { return (!helpers.isEmpty(_el.pageYOffset) ? _el.pageYOffset : document.scrollTop) - (document.clientTop || 0); },
    set: function(v) { _el.scrollTo(_scope.scrollLeft, v); }
  });

  helpers.property(_scope, "scrollLeft", {
    get: function() { return (!helpers.isEmpty(_el.pageXOffset) ? _el.pageXOffset : document.scrollLeft) - (document.clientLeft || 0); },
    set: function(v) { _el.scrollTo(v, _scope.scrollTop); }
  });
});
