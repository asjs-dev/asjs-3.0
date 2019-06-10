require("../media/asjs.AbstractMediaPlayer.js");

createClass(ASJS, "VideoPlayer", ASJS.AbstractMediaPlayer, function(_scope, _super) {
  _scope.new = function() {
    _super.new("video");
  }

  prop(_scope, "poster", {
    get: function() { return _scope.el.poster; },
    set: function(v) { _scope.el.poster = v; }
  });
});
