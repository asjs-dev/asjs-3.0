require("../asjs.Tag.js");

createClass(ASJS, "VideoTrack", ASJS.Tag, function(_scope, _super) {
  _scope.new = function() {
    _super.new("track");
  }

  prop(_scope, "src", {
    get: function() { return _scope.getAttr("src"); },
    set: function(v) { _scope.setAttr("src", v); }
  });

  prop(_scope, "kind", {
    get: function() { return _scope.getAttr("kind"); },
    set: function(v) { _scope.setAttr("kind", v); }
  });

  prop( _scope, "label", {
    get: function() { return _scope.getAttr("label"); },
    set: function(v) { _scope.setAttr("label", v); }
  });

  prop(_scope, "srclang", {
    get: function() { return _scope.getAttr("srclang"); },
    set: function(v) { _scope.setAttr("srclang", v); }
  });
});
cnst(ASJS.VideoTrack, "KIND_CAPTIONS",     "captions");
cnst(ASJS.VideoTrack, "KIND_CHAPTERS",     "chapters");
cnst(ASJS.VideoTrack, "KIND_DESCRIPTIONS", "descriptions");
cnst(ASJS.VideoTrack, "KIND_METADATA",     "metadata");
cnst(ASJS.VideoTrack, "KIND_SUBTITLES",    "subtitles");
