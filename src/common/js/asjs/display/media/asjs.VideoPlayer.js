require("../media/asjs.AbstractMediaPlayer.js");

createClass(ASJS, "VideoPlayer", ASJS.AbstractMediaPlayer, function(_scope, _super) {
  _scope.new = _super.new.bind(_scope, "video");

  prop(_scope, "poster", {
    get: function() { return _scope.el.poster; },
    set: function(v) { _scope.el.poster = v; }
  });
});
