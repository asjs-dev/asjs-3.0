ASJS.import("com/asjs/utils/asjs.Cycler.js");

ASJS.Easing = createClass(
"Easing",
ASJS.BaseClass,
function(_scope) {
  var _cycler = ASJS.Cycler.instance;
  var _isPlaying;
  var _id;
  var _step;
  var _target;
  var _from;
  var _change;
  var _to;
  var _type;
  var _duration;
  var _stepCallback;
  var _completeCallback;
  
  _scope.new = function() {
    _scope.stop();
  }
  
  _scope.stop = function() {
    _isPlaying = false;
    _cycler.removeCallback(update);
  }

  _scope.play = function(target, to, duration, type, stepCallback, completeCallback) {
    _target = target;
    _from = {};
    _change = {};
    _to = to;
    _type = type;
    _duration = (duration / (1000 / _cycler.fps));
    _stepCallback = stepCallback;
    _completeCallback = completeCallback;

    iterateParameters(function(k) {
      _from[k] = _target[k];
      _change[k] = _to[k] - _from[k];
    });

    if (!ASJS.Easing[_type]) _type = "linearTween";

    letsPlay();
  }
  
  function letsPlay() {
    if (_isPlaying) return;
    _step = 0;
    _isPlaying = true;
    _cycler.addCallback(update);
  }

  function update() {
    if (!_isPlaying) return;

    if (_step >= _duration) {
      _scope.stop();
      iterateParameters(function(k) {
        _target[k] = _to[k];
      });
      if (_stepCallback) _stepCallback();
      if (_completeCallback) _completeCallback();
      return;
    }

    iterateParameters(function(k) {
      _target[k] = ASJS.Easing[_type](_step, _from[k], _change[k], _duration);
    });

    if (_stepCallback) _stepCallback();
    _step++;
  }

  function iterateParameters(callback) {
    for (var k in _to) callback(k);
  }
});
rof(ASJS.Easing, "linearTween", function(t, b, c, d) {
  return c*t/d + b;
});
rof(ASJS.Easing, "easeInQuad", function(t, b, c, d) {
  t /= d;
  return c*t*t + b;
});
rof(ASJS.Easing, "easeOutQuad", function(t, b, c, d) {
  t /= d;
  return -c * t*(t-2) + b;
});
rof(ASJS.Easing, "easeInOutQuad", function(t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t + b;
  t--;
  return -c/2 * (t*(t-2) - 1) + b;
});
rof(ASJS.Easing, "easeInCubic", function(t, b, c, d) {
  t /= d;
  return c*t*t*t + b;
});
rof(ASJS.Easing, "easeOutCubic", function(t, b, c, d) {
  t /= d;
  t--;
  return c*(t*t*t + 1) + b;
});
rof(ASJS.Easing, "easeInOutCubic", function(t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t*t + b;
  t -= 2;
  return c/2*(t*t*t + 2) + b;
});
rof(ASJS.Easing, "easeInQuart", function(t, b, c, d) {
  t /= d;
  return c*t*t*t*t + b;
});
rof(ASJS.Easing, "easeOutQuart", function(t, b, c, d) {
  t /= d;
  t--;
  return -c * (t*t*t*t - 1) + b;
});
rof(ASJS.Easing, "easeInOutQuart", function(t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t*t*t + b;
  t -= 2;
  return -c/2 * (t*t*t*t - 2) + b;
});
rof(ASJS.Easing, "easeInQuint", function(t, b, c, d) {
  t /= d;
  return c*t*t*t*t*t + b;
});
rof(ASJS.Easing, "easeOutQuint", function(t, b, c, d) {
  t /= d;
  t--;
  return c*(t*t*t*t*t + 1) + b;
});
rof(ASJS.Easing, "easeInOutQuint", function(t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t*t*t*t + b;
  t -= 2;
  return c/2*(t*t*t*t*t + 2) + b;
});
rof(ASJS.Easing, "easeInSine", function(t, b, c, d) {
  return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
});
rof(ASJS.Easing, "easeOutSine", function(t, b, c, d) {
  return c * Math.sin(t/d * (Math.PI/2)) + b;
});
rof(ASJS.Easing, "easeInOutSine", function(t, b, c, d) {
  return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
});
rof(ASJS.Easing, "easeInExpo", function(t, b, c, d) {
  return c * Math.pow(2, 10 * (t/d - 1)) + b;
});
rof(ASJS.Easing, "easeOutExpo", function(t, b, c, d) {
  return c * (-Math.pow(2, -10 * t/d) + 1) + b;
});
rof(ASJS.Easing, "easeInOutExpo", function(t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
  t--;
  return c/2 * (-Math.pow(2, -10 * t) + 2) + b;
});
rof(ASJS.Easing, "easeInCirc", function(t, b, c, d) {
  t /= d;
  return -c * (Math.sqrt(1 - t*t) - 1) + b;
});
rof(ASJS.Easing, "easeOutCirc", function(t, b, c, d) {
  t /= d;
  t--;
  return c * Math.sqrt(1 - t*t) + b;
});
rof(ASJS.Easing, "easeInOutCirc", function(t, b, c, d) {
  t /= d/2;
  if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
  t -= 2;
  return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
});
