require("../asjs.Sprite.js");

helpers.createClass(ASJS, "AbstractMediaPlayer", ASJS.Sprite, function(_scope, _super) {
  helpers.override(_scope, _super, "new");
  _scope.new = function(tag) {
    _super.new(tag);
    _scope.controls = false;
    _scope.preload = ASJS.AbstractMediaPlayer.PRELOAD_AUTO;
  }

  helpers.get(_scope, "buffered", function() { return _scope.el.buffered; });

  helpers.get(_scope, "controller", function() { return _scope.el.controller; });

  helpers.get(_scope, "currentSrc", function() { return _scope.el.currentSrc; });

  helpers.get(_scope, "duration", function() { return _scope.el.duration; });

  helpers.get(_scope, "ended", function() { return _scope.el.ended; });

  helpers.get(_scope, "error", function() { return _scope.el.error; });

  helpers.get(_scope, "networkState", function() { return _scope.el.networkState; });

  helpers.get(_scope, "paused", function() { return _scope.el.paused; });

  helpers.get(_scope, "played", function() { return _scope.el.played; });

  helpers.get(_scope, "readyState", function() { return _scope.el.readyState; });

  helpers.get(_scope, "seekable", function() { return _scope.el.seekable; });

  helpers.get(_scope, "seeking", function() { return _scope.el.seeking; });

  helpers.get(_scope, "startDate", function() { return _scope.el.startDate; });

  helpers.get(_scope, "textTracks", function() { return _scope.el.textTracks; });

  helpers.property(_scope, "controls", {
    get: function() { return _scope.el.controls; },
    set: function(v) { _scope.el.controls = v; }
  });

  helpers.property(_scope, "preload", {
    get: function() { return _scope.el.preload; },
    set: function(v) { _scope.el.preload = v; }
  });

  helpers.property(_scope, "muted", {
    get: function() { return _scope.el.muted; },
    set: function(v) { _scope.el.muted = v; }
  });

  helpers.property(_scope, "loop", {
    get: function() { return _scope.el.loop; },
    set: function(v) { _scope.el.loop = v; }
  });

  helpers.property(_scope, "autoplay", {
    get: function() { return _scope.el.autoplay; },
    set: function(v) { _scope.el.autoplay = v; }
  });

  helpers.property(_scope, "src", {
    get: function() { return _scope.el.src; },
    set: function(v) { _scope.el.src = v; }
  });

  helpers.property(_scope, "crossOrigin", {
    get: function() { return _scope.el.crossOrigin; },
    set: function(v) { _scope.el.crossOrigin = v; }
  });

  helpers.property(_scope, "currentTime", {
    get: function() { return _scope.el.currentTime; },
    set: function(v) { _scope.el.currentTime = v; }
  });

  helpers.property(_scope, "defaultMuted", {
    get: function() { return _scope.el.defaultMuted; },
    set: function(v) { _scope.el.defaultMuted = v; }
  });

  helpers.property(_scope, "defaultPlaybackRate", {
    get: function() { return _scope.el.defaultPlaybackRate; },
    set: function(v) { _scope.el.defaultPlaybackRate = v; }
  });

  helpers.property(_scope, "mediaGroup", {
    get: function() { return _scope.el.mediaGroup; },
    set: function(v) { _scope.el.mediaGroup = v; }
  });

  helpers.property(_scope, "playbackRate", {
    get: function() { return _scope.el.playbackRate; },
    set: function(v) { _scope.el.playbackRate = v; }
  });

  helpers.property(_scope, "volume", {
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
helpers.constant(ASJS.AbstractMediaPlayer, "PRELOAD_NONE",     "none");
helpers.constant(ASJS.AbstractMediaPlayer, "PRELOAD_AUTO",     "auto");
helpers.constant(ASJS.AbstractMediaPlayer, "PRELOAD_METADATA", "metadata");
