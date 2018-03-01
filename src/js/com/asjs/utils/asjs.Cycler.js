ASJS.Cycler = createSingletonClass(
"Cycler",
ASJS.BaseClass,
function(_scope) {
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
    if (!_scope.callbackExists(callback)) return;

    var i = -1;
    var l = _callbacks.length;
    var index;
    while (++i < l) {
      if (_callbacks[i] === callback) index = i;
    }

    _callbacks.splice(index, 1);
  };

  _scope.callbackExists = function(callback) {
    var i = -1;
    var l = _callbacks.length;
    while (++i < l) {
      if (_callbacks[i] === callback) return true;
    }

    return false;
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

    _timeoutId = setTimeout(function() {
      requestAnimationFrame(tick);
    }, _interval);
  };

  function getIntervalByFps() {
    return 1000 / _fps;
  };
});
