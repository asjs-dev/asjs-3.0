var AbstractView = createClass(
"AbstractView",
ASJS.Sprite,
function(_scope, _super) {
  var _completeCallback;

  _scope.new = function() {
    _super.new();

    _scope.addEventListener(ASJS.Stage.ADDED_TO_STAGE,          addedToStage);
    _scope.addEventListener(ASJS.AnimationEvent.TRANSITION_END, onTransitionEnd);

    _scope.addClass("animate");
  }

  _super.protected.animateTo = function(to, completeCallback) {
    _completeCallback = completeCallback;
    _scope.alpha = Math.max(0, Math.min(1, to));
  }

  _scope.hide = function(callback) {
    _super.protected.animateTo(0, callback);
  }

  function addedToStage() {
    _scope.alpha = 0;

    requestAnimationFrame(function() {
      _super.protected.animateTo(1);
    });
  }

  function onTransitionEnd() {
    _completeCallback && _completeCallback();
    _completeCallback = null;
  }
});
