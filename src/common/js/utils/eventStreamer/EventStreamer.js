require("../../NameSpace.js");

createClass(ASJSUtils, "EventStreamer", ASJS.EventDispatcher, function(_scope) {
  var _stream;

  _scope.target;
  _scope.eventTypes;

  _scope.new = _scope.reset;

  get(_scope, "stream", function() { return _stream; });

  _scope.reset = function() {
    _scope.stopWatch();
    _scope.target = null;
    _scope.eventTypes = "";
    _stream = [];
  }

  _scope.startWatch = function() {
    _scope.stopWatch();
    _scope.target.addEventListener(_scope.eventTypes, onEventStream);
  }

  _scope.stopWatch = function() {
    if (!_scope.eventTypes || !_scope.target) return;
    var types = tis(_scope.eventTypes, "object") ? _scope.eventTypes : _scope.eventTypes.split(" ");
    var i = types.length;
    while (i--) _scope.target.removeEventListener(types[i], onEventStream);
  }

  function onEventStream(e) {
    _stream.push(e);
  }
});
