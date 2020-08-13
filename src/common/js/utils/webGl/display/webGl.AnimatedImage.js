require("./webGl.Image.js");
require("../NameSpace.js");

WebGl.AnimatedImage = createPrototypeClass(
  WebGl.Image,
  function AnimatedImage(texture) {
    WebGl.Image.call(this, texture);

    this.frameLength = 120;
    this.frame       = 0;
    this.frames      = [];
    this.isPlaying   = false;

    this._latestUpdate = -1;
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
        var ellapsedTime = renderTime - this._latestUpdate;
        if (ellapsedTime >= this.frameLength) {
          this._latestUpdate = renderTime;
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
      _super.destruct();
    }
  }
);
