require("./asjs.AbstractMediaPlayer.js");

helpers.createClass(ASJS, "AudioPlayer", ASJS.AbstractMediaPlayer, function(_scope, _super) {
  helpers.override(_scope, _super, "new");
  _scope.new = _super.new.bind(_scope, "audio");
});
