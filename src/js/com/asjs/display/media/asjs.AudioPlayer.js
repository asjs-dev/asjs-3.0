ASJS.import("com/asjs/display/media/asjs.AbstractMediaPlayer.js");

ASJS.AudioPlayer = createClass(
"AudioPlayer",
ASJS.AbstractMediaPlayer,
function(_scope, _super) {
  _scope.new = function() {
    _super.new("audio");
  }
});
