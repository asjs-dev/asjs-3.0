var AbstractView = createClass(
"AbstractView",
ASJS.Sprite,
function(_scope, _super) {
  var _completeCallback = [];

  _scope.new = function() {
    _super.new();
    _scope.addClass("animated");
    _scope.addEventListener(ASJS.Stage.ADDED_TO_STAGE,          addedToStage);
    _scope.addEventListener(ASJS.AnimationEvent.TRANSITION_END, onTransitionEnd);
  }

  _super.protected.animateTo = function(to, completeCallback) {
    _completeCallback.push(completeCallback);
    _scope.alpha = to;
  }

  function addedToStage() {
    _super.protected.animateTo(1);
  }

  function onTransitionEnd() {
    while (_completeCallback.length > 0) {
      var completeCallback = _completeCallback.shift();
          completeCallback && completeCallback();
    }
  }
});
