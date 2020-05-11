createClass(ASJS, "Timer", ASJS.BaseClass, function(_scope, _super) {
  var _then;

  _scope.start = function() {
    _then = Date.now();
  }

  _scope.stop = function() {
    _then = null;
  }

  _scope.tick = function() {
    var now = Date.now();
    var delta = now - _then;
    _then = now;
    return delta;
  }

  _scope.destruct = function() {
    _scope.stop();
    _super.destruct();
  }
});
