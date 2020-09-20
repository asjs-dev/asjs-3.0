require("../asjs.Tag.js");

helpers.createClass(ASJS, "Source", ASJS.Tag, function(_scope, _super) {
  helpers.override(_scope, _super, "new");
  _scope.new = function(src, type) {
    _super.new("source");
    _scope.src = src;
    _scope.type = type;
  }

  ASJS.Tag.attrProp(_scope, "type");
  ASJS.Tag.attrProp(_scope, "src");
});
helpers.constant(ASJS.Source, "TYPE_AUDIO_MP3",  "audio/mpeg");
helpers.constant(ASJS.Source, "TYPE_AUDIO_OGG",  "audio/ogg");
helpers.constant(ASJS.Source, "TYPE_AUDIO_WAV",  "audio/wav");
helpers.constant(ASJS.Source, "TYPE_VIDEO_MP4",  "video/mp4");
helpers.constant(ASJS.Source, "TYPE_VIDEO_OGG",  "video/ogg");
helpers.constant(ASJS.Source, "TYPE_VIDEO_WEBM", "video/webm");
