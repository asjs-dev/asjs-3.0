require("./agl.Image.js");
require("../NameSpace.js");

AGL.AnimatedImage = createPrototypeClass(
  AGL.Image,
  function AnimatedImage(texture) {
    AGL.Image.call(this, texture);

    this.frameLength = 120;
    this.frame       = 0;
    this.frames      = [];
    this.isPlaying   = false;

    this._currentRenderTime = 0;
  },
  function(_super) {
    this.gotoAndStop = function(frame) {
      this.frame = frame;
    }

    this.gotoAndPlay = function(frame) {
      this.frame = frame;
      this.play();
    }

    this.stop = function() {
      this.isPlaying = false;
    }

    this.play = function() {
      this.isPlaying = true;
    }

    this.update = function(renderTime) {
      this.updateAnimation(renderTime);
      _super.update.call(this);
    }

    this.updateAnimation = function(renderTime) {
      if (this.isPlaying) {
        var ellapsedTime = renderTime - this._currentRenderTime;
        if (ellapsedTime >= this.frameLength) {
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
    }

    this.destruct = function() {
      this.stop();
      _super.destruct.call(this);
    }
  }
);
