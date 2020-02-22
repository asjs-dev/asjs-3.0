require("./asjs.AbstractMediaPlayer.js");

createClass(ASJS, "AudioPlayer", ASJS.AbstractMediaPlayer, function(_scope, _super) {
  _scope.new = _super.new.bind(_scope, "audio");
});
