require("./asjs.AbstractMediaPlayer.js");

createClass(ASJS, "AudioPlayer", ASJS.AbstractMediaPlayer, function(_scope, _super) {
  _scope.new = function() {
    _super.new("audio");
  }
});
