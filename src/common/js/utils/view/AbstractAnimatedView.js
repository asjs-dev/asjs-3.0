require("../../helpers/createClass.js");
require("../../helpers/mathHelper.js");

require("../NameSpace.js");

helpers.createClass(ASJSUtils, "AbstractAnimatedView", ASJS.AbstractView, function(_scope, _super) {
  var _completeCallback;

  helpers.override(_scope, _super, "new");
  _scope.new = function() {
    _super.new();

    _scope.addEventListener(ASJS.Stage.ADDED_TO_STAGE,          addedToStage);
    _scope.addEventListener(ASJS.AnimationEvent.TRANSITION_END, onTransitionEnd);

    _scope.addClass("abstract-view animate");
  }

  _super.protected.animateTo = function(to, completeCallback) {
    _completeCallback = completeCallback;
    _scope.alpha = helpers.between(0, 1, to);
  }

  _scope.hide = _super.protected.animateTo.bind(_scope, 0);

  helpers.override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _completeCallback = null;
    _super.destruct();
  }

  function addedToStage(event) {
    if (event.target !== _scope.el) return;

    _scope.alpha = 0;

    requestAnimationFrame(function() {
      _super.protected.animateTo(1);
    });
  }

  function onTransitionEnd(event) {
    if (event.target !== _scope.el) return;

    _completeCallback && _completeCallback();
    _completeCallback = null;
  }
});
