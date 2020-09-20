require("../asjs.Tag.js");

helpers.createClass(ASJS, "VideoTrack", ASJS.Tag, function(_scope, _super) {
  helpers.override(_scope, _super, "new");
  _scope.new = _super.new.bind(_scope, "track");

  ASJS.Tag.attrProp(_scope, "src");
  ASJS.Tag.attrProp(_scope, "kind");
  ASJS.Tag.attrProp(_scope, "label");
  ASJS.Tag.attrProp(_scope, "srclang");
});
helpers.constant(ASJS.VideoTrack, "KIND_CAPTIONS",     "captions");
helpers.constant(ASJS.VideoTrack, "KIND_CHAPTERS",     "chapters");
helpers.constant(ASJS.VideoTrack, "KIND_DESCRIPTIONS", "descriptions");
helpers.constant(ASJS.VideoTrack, "KIND_METADATA",     "metadata");
helpers.constant(ASJS.VideoTrack, "KIND_SUBTITLES",    "subtitles");
