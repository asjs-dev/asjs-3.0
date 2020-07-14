require("./webGl.Image.js");
require("../NameSpace.js");

createClass(WebGl, "AnimatedImage", WebGl.Image, function(_scope, _super) {
  _scope.frameLength = 120;
  _scope.frame       = 0;
  _scope.frames      = [];
  _scope.isPlaying   = false;

  var _latestUpdate = -1;

  _scope.gotoAndStop = function(frame) {
    _scope.frame = frame;
  }

  _scope.gotoAndPlay = function(frame) {
    _scope.frame = frame;
    _scope.play();
  }

  _scope.stop = function() {
    _scope.isPlaying = false;
  }

  _scope.play = function() {
    _scope.isPlaying = true;
  }

  _scope.preRender = function() {
    _scope.updateTextureCrop();
  }

  _scope.postRender = function(now) {
    if (_scope.isPlaying) {
      var ellapsedTime = now - _latestUpdate;
      if (ellapsedTime >= _scope.frameLength) {
        _latestUpdate = now;
        _scope.frame += Math.floor(ellapsedTime / _scope.frameLength);
        _scope.frame >= _scope.frames.length && (_scope.frame = 0);
      }
    }
  }

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _scope.stop();

    _scope.frameLength =
    _scope.frame       =
    _scope.frames      =
    _scope.isPlaying   = null;

    _super.destruct();
  }

  _scope.updateTextureCrop = function() {
      var textureCrop = _scope.frames[_scope.frame];

      _scope.textureCropCache[0] = textureCrop.x;
      _scope.textureCropCache[1] = textureCrop.y;
      _scope.textureCropCache[2] = textureCrop.width;
      _scope.textureCropCache[3] = textureCrop.height;
  }
});
