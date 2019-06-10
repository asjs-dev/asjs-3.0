createSingletonClass(ASJS, "Cycler", ASJS.BaseClass, function(_scope) {
  var _isPlaying = false;
  var _fps       = 24;
  var _interval  = getIntervalByFps();
  var _callbacks = [];
  var _timeoutId;

  get(_scope, "isPlaying", function() { return _isPlaying; });

  prop(_scope, "fps", {
    get: function() { return _fps; },
    set: function(v) {
      _fps = v;
      _interval = getIntervalByFps();
      _scope.start();
    }
  });

  _scope.addCallback = function(callback) {
    if (!_scope.callbackExists(callback)) _callbacks.push(callback);
  };

  _scope.removeCallback = function(callback) {
    _callbacks.remove(callback);
  };

  _scope.getCallbackId = function(callback) {
    return _callbacks.indexOf(callback);
  }

  _scope.callbackExists = function(callback) {
    return _callbacks.has(callback);
  };

  _scope.start = function() {
    _isPlaying = true;
    tick();
  };

  _scope.stop = function() {
    _isPlaying = false;
    _timeoutId = clearTimeout(_timeoutId);
  };
  function tick() {
    _timeoutId = clearTimeout(_timeoutId);

    var i = -1;
    var l = _callbacks.length;
    while (++i < l) {
      _callbacks[i] && _callbacks[i]();
    }

    _timeoutId = setTimeout(tick, _interval);
  };

  function getIntervalByFps() {
    return 1000 / _fps;
  };
});
