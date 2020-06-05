require("../asjs.Sprite.js");

createClass(ASJS, "AbstractMediaPlayer", ASJS.Sprite, function(_scope, _super) {
  override(_scope, _super, "new");
  _scope.new = function(tag) {
    _super.new(tag);
    _scope.controls = false;
    _scope.preload = ASJS.AbstractMediaPlayer.PRELOAD_AUTO;
  }

  get(_scope, "buffered", function() { return _scope.el.buffered; });

  get(_scope, "controller", function() { return _scope.el.controller; });

  get(_scope, "currentSrc", function() { return _scope.el.currentSrc; });

  get(_scope, "duration", function() { return _scope.el.duration; });

  get(_scope, "ended", function() { return _scope.el.ended; });

  get(_scope, "error", function() { return _scope.el.error; });

  get(_scope, "networkState", function() { return _scope.el.networkState; });

  get(_scope, "paused", function() { return _scope.el.paused; });

  get(_scope, "played", function() { return _scope.el.played; });

  get(_scope, "readyState", function() { return _scope.el.readyState; });

  get(_scope, "seekable", function() { return _scope.el.seekable; });

  get(_scope, "seeking", function() { return _scope.el.seeking; });

  get(_scope, "startDate", function() { return _scope.el.startDate; });

  get(_scope, "textTracks", function() { return _scope.el.textTracks; });

  prop(_scope, "controls", {
    get: function() { return _scope.el.controls; },
    set: function(v) { _scope.el.controls = v; }
  });

  prop(_scope, "preload", {
    get: function() { return _scope.el.preload; },
    set: function(v) { _scope.el.preload = v; }
  });

  prop(_scope, "muted", {
    get: function() { return _scope.el.muted; },
    set: function(v) { _scope.el.muted = v; }
  });

  prop(_scope, "loop", {
    get: function() { return _scope.el.loop; },
    set: function(v) { _scope.el.loop = v; }
  });

  prop(_scope, "autoplay", {
    get: function() { return _scope.el.autoplay; },
    set: function(v) { _scope.el.autoplay = v; }
  });

  prop(_scope, "src", {
    get: function() { return _scope.el.src; },
    set: function(v) { _scope.el.src = v; }
  });

  prop(_scope, "crossOrigin", {
    get: function() { return _scope.el.crossOrigin; },
    set: function(v) { _scope.el.crossOrigin = v; }
  });

  prop(_scope, "currentTime", {
    get: function() { return _scope.el.currentTime; },
    set: function(v) { _scope.el.currentTime = v; }
  });

  prop(_scope, "defaultMuted", {
    get: function() { return _scope.el.defaultMuted; },
    set: function(v) { _scope.el.defaultMuted = v; }
  });

  prop(_scope, "defaultPlaybackRate", {
    get: function() { return _scope.el.defaultPlaybackRate; },
    set: function(v) { _scope.el.defaultPlaybackRate = v; }
  });

  prop(_scope, "mediaGroup", {
    get: function() { return _scope.el.mediaGroup; },
    set: function(v) { _scope.el.mediaGroup = v; }
  });

  prop(_scope, "playbackRate", {
    get: function() { return _scope.el.playbackRate; },
    set: function(v) { _scope.el.playbackRate = v; }
  });

  prop(_scope, "volume", {
    get: function() { return _scope.el.volume; },
    set: function(v) { _scope.el.volume = v; }
  });

  _scope.play = function() {
    _scope.el.play();
  }

  _scope.pause = function() {
    _scope.el.pause();
  }

  _scope.load = function() {
    _scope.el.load();
  }

  _scope.unload = function() {
    _scope.clear();
    _scope.removeAttr("src");
  }
});
cnst(ASJS.AbstractMediaPlayer, "PRELOAD_NONE",     "none");
cnst(ASJS.AbstractMediaPlayer, "PRELOAD_AUTO",     "auto");
cnst(ASJS.AbstractMediaPlayer, "PRELOAD_METADATA", "metadata");
