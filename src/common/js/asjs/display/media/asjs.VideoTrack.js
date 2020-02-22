require("../asjs.Tag.js");

createClass(ASJS, "VideoTrack", ASJS.Tag, function(_scope, _super) {
  _scope.new = _super.new.bind(_scope, "track");

  ASJS.Tag.attrProp(_scope, "src");
  ASJS.Tag.attrProp(_scope, "kind");
  ASJS.Tag.attrProp(_scope, "label");
  ASJS.Tag.attrProp(_scope, "srclang");
});
cnst(ASJS.VideoTrack, "KIND_CAPTIONS",     "captions");
cnst(ASJS.VideoTrack, "KIND_CHAPTERS",     "chapters");
cnst(ASJS.VideoTrack, "KIND_DESCRIPTIONS", "descriptions");
cnst(ASJS.VideoTrack, "KIND_METADATA",     "metadata");
cnst(ASJS.VideoTrack, "KIND_SUBTITLES",    "subtitles");
