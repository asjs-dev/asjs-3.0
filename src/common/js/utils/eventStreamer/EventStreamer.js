require("../../NameSpace.js");

createClass(ASJSUtils, "EventStreamer", ASJS.EventDispatcher, function(_scope) {
  var _target;
  var _eventTypes;
  var _stream;

  _scope.new = _scope.reset;

  prop(_scope, "target", {
    get: function() { return _target; },
    set: function(v) { _target = v; }
  });

  prop(_scope, "eventTypes", {
    get: function() { return _eventTypes; },
    set: function(v) { _eventTypes = v; }
  });

  get(_scope, "stream", function() { return _stream; });

  _scope.reset = function() {
    _scope.stopWatch();
    _target = null;
    _eventTypes = "";
    _stream = [];
  }

  _scope.startWatch = function() {
    _scope.stopWatch();
    _target.addEventListener(_eventTypes, onEventStream);
  }

  _scope.stopWatch = function() {
    if (!_eventTypes || !_target) return;
    var types = _eventTypes.indexOf(" ") > -1 ? _eventTypes.split(" ") : [eventTypes];
    var i = types.length;
    while (i--) _target.removeEventListener(types[i], onEventStream);
  }

  function onEventStream(e) {
    _stream.push(e);
  }
});
