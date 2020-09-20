require("../media/asjs.AbstractMediaPlayer.js");

helpers.createClass(ASJS, "VideoPlayer", ASJS.AbstractMediaPlayer, function(_scope, _super) {
  helpers.override(_scope, _super, "new");
  _scope.new = _super.new.bind(_scope, "video");

  helpers.property(_scope, "poster", {
    get: function() { return _scope.el.poster; },
    set: function(v) { _scope.el.poster = v; }
  });
});
