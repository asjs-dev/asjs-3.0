createClass(ASJS, "Timer", BaseClass, function(_scope, _super) {
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

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _scope.stop();
    _super.destruct();
  }
});
