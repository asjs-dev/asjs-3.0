require("../../utils/asjs.Cycler.js");

helpers.createClass(ASJS, "Easing", helpers.BaseClass, function(_scope, _super) {
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
    _target   = target;
    _from     = {};
    _change   = {};
    _to       = to;
    _type     = type;
    _duration = Math.round(duration / (1e3 / _cycler.fps));

    _stepCallback     = stepCallback;
    _completeCallback = completeCallback;

    helpers.map(_to, function(k, item) {
      _from[k]   = _target[k];
      _change[k] = item - _from[k];
    });

    if (!ASJS.Easing[_type]) _type = "linearTween";

    letsPlay();
  }

  helpers.override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _scope.stop();

    _cycler           =
    _isPlaying        =
    _id               =
    _step             =
    _target           =
    _from             =
    _change           =
    _to               =
    _type             =
    _duration         =
    _stepCallback     =
    _completeCallback = null;

    _super.destruct();
  }

  function letsPlay() {
    if (_isPlaying) return;
    _step      = 1;
    _isPlaying = true;
    _cycler.addCallback(update);
  }

  function update() {
    if (!_isPlaying) return;

    if (_step >= _duration) {
      _scope.stop();

      helpers.map(_to, function(k, item) {
        _target[k] = item;
      });

      _stepCallback && _stepCallback(_step, _duration);
      _completeCallback && _completeCallback();

      return;
    }

    helpers.map(_to, function(k) {
      _target[k] = ASJS.Easing[_type](_step, _from[k], _change[k], _duration);
    });

    _stepCallback && _stepCallback(_step, _duration);

    _step++;
  }
});
helpers.constant(ASJS.Easing, "linearTween", function(t, b, c, d) {
  return c*t/d + b;
});
helpers.constant(ASJS.Easing, "easeInQuad", function(t, b, c, d) {
  t /= d;
  return c*t*t + b;
});
helpers.constant(ASJS.Easing, "easeOutQuad", function(t, b, c, d) {
  t /= d;
  return -c * t*(t-2) + b;
});
helpers.constant(ASJS.Easing, "easeInOutQuad", function(t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t + b;
  t--;
  return -c/2 * (t*(t-2) - 1) + b;
});
helpers.constant(ASJS.Easing, "easeInCubic", function(t, b, c, d) {
  t /= d;
  return c*t*t*t + b;
});
helpers.constant(ASJS.Easing, "easeOutCubic", function(t, b, c, d) {
  t /= d;
  t--;
  return c*(t*t*t + 1) + b;
});
helpers.constant(ASJS.Easing, "easeInOutCubic", function(t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t*t + b;
  t -= 2;
  return c/2*(t*t*t + 2) + b;
});
helpers.constant(ASJS.Easing, "easeInQuart", function(t, b, c, d) {
  t /= d;
  return c*t*t*t*t + b;
});
helpers.constant(ASJS.Easing, "easeOutQuart", function(t, b, c, d) {
  t /= d;
  t--;
  return -c * (t*t*t*t - 1) + b;
});
helpers.constant(ASJS.Easing, "easeInOutQuart", function(t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t*t*t + b;
  t -= 2;
  return -c/2 * (t*t*t*t - 2) + b;
});
helpers.constant(ASJS.Easing, "easeInQuint", function(t, b, c, d) {
  t /= d;
  return c*t*t*t*t*t + b;
});
helpers.constant(ASJS.Easing, "easeOutQuint", function(t, b, c, d) {
  t /= d;
  t--;
  return c*(t*t*t*t*t + 1) + b;
});
helpers.constant(ASJS.Easing, "easeInOutQuint", function(t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t*t*t*t + b;
  t -= 2;
  return c/2*(t*t*t*t*t + 2) + b;
});
helpers.constant(ASJS.Easing, "easeInSine", function(t, b, c, d) {
  return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
});
helpers.constant(ASJS.Easing, "easeOutSine", function(t, b, c, d) {
  return c * Math.sin(t/d * (Math.PI/2)) + b;
});
helpers.constant(ASJS.Easing, "easeInOutSine", function(t, b, c, d) {
  return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
});
helpers.constant(ASJS.Easing, "easeInExpo", function(t, b, c, d) {
  return c * Math.pow(2, 10 * (t/d - 1)) + b;
});
helpers.constant(ASJS.Easing, "easeOutExpo", function(t, b, c, d) {
  return c * (-Math.pow(2, -10 * t/d) + 1) + b;
});
helpers.constant(ASJS.Easing, "easeInOutExpo", function(t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
  t--;
  return c/2 * (-Math.pow(2, -10 * t) + 2) + b;
});
helpers.constant(ASJS.Easing, "easeInCirc", function(t, b, c, d) {
  t /= d;
  return -c * (Math.sqrt(1 - t*t) - 1) + b;
});
helpers.constant(ASJS.Easing, "easeOutCirc", function(t, b, c, d) {
  t /= d;
  t--;
  return c * Math.sqrt(1 - t*t) + b;
});
helpers.constant(ASJS.Easing, "easeInOutCirc", function(t, b, c, d) {
  t /= d/2;
  if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
  t -= 2;
  return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
});
