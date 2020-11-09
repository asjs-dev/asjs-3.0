require("./agl.Image.js");
require("../NameSpace.js");

AGL.AnimatedImage = helpers.createPrototypeClass(
  AGL.Image,
  function AnimatedImage(texture) {
    AGL.Image.call(this, texture);

    this.frameLength = 120;
    this.frames      = [];
    this.isPlaying   = false;

    this.frame              =
    this._currentRenderTime = 0;

    this.updateAnimation;
    this.stop();
  },
  function(_scope, _super) {
    _scope.gotoAndStop = function(frame) {
      this.frame = frame;
    }

    _scope.gotoAndPlay = function(frame) {
      this.frame = frame;
      this.play();
    }

    _scope.stop = function() {
      this.isPlaying = false;
      this.updateAnimation = helpers.emptyFunction;
    }

    _scope.play = function() {
      this.isPlaying = true;
      this.updateAnimation = this._updateAnimation;
    }

    _scope.update = function(renderTime) {
      this.updateAnimation(renderTime);
      _super.update.call(this);
    }

    _scope._updateAnimation = function(renderTime) {
      var ellapsedTime = renderTime - this._currentRenderTime;
      if (ellapsedTime > this.frameLength) {
        this._currentRenderTime = renderTime;
        this.frame += Math.floor(ellapsedTime / this.frameLength);
        this.frame >= this.frames.length && (this.frame = 0);

        var textureFrameCrop = this.frames[this.frame];
        var textureCrop      = this.textureCrop;

        textureCrop.x      = textureFrameCrop.x;
        textureCrop.y      = textureFrameCrop.y;
        textureCrop.width  = textureFrameCrop.width;
        textureCrop.height = textureFrameCrop.height;
      }
    }

    _scope.destruct = function() {
      this.stop();

      _super.destruct.call(this);
    }
  }
);
