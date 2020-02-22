require("../asjs.Tag.js");

createClass(ASJS, "Source", ASJS.Tag, function(_scope, _super) {
  _scope.new = function(src, type) {
    _super.new("source");
    _scope.src = src;
    _scope.type = type;
  }

  ASJS.Tag.attrProp(_scope, "type");
  ASJS.Tag.attrProp(_scope, "src");
});
cnst(ASJS.Source, "TYPE_AUDIO_MP3",  "audio/mpeg");
cnst(ASJS.Source, "TYPE_AUDIO_OGG",  "audio/ogg");
cnst(ASJS.Source, "TYPE_AUDIO_WAV",  "audio/wav");
cnst(ASJS.Source, "TYPE_VIDEO_MP4",  "video/mp4");
cnst(ASJS.Source, "TYPE_VIDEO_OGG",  "video/ogg");
cnst(ASJS.Source, "TYPE_VIDEO_WEBM", "video/webm");
