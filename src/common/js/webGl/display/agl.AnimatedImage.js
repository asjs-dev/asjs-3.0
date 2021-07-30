require("./agl.Image.js");
require("../NameSpace.js");

AGL.AnimatedImage = helpers.createPrototypeClass(
  AGL.Image,
  function AnimatedImage(texture) {
    AGL.Image.call(this, texture);

    this.frameLength = 120;
    this.frames      = [];

    this.frame              =
    this._currentRenderTime = 0;

    this.updateAnimation;
    this.stop();
  },
  function(_scope, _super) {
    helpers.get(_scope, "isPlaying", function() { return this.updateAnimation === this._updateAnimation; });

    _scope.gotoAndStop = function(frame) {
      this.stop();
      this.frame = frame;
      this._useTextureFrame();
    }

    _scope.gotoAndPlay = function(frame) {
      this.frame = frame;
      this.play();
    }

    _scope.stop = function() {
      this.updateAnimation = helpers.emptyFunction;
    }

    _scope.play = function() {
      this.updateAnimation = this._updateAnimation;
    }

    _scope.update = function(renderTime) {
      _super.update.call(this);
      this.updateAnimation(renderTime);
    }

    _scope._updateAnimation = function(renderTime) {
      var ellapsedTime = renderTime - this._currentRenderTime;
      if (ellapsedTime > this.frameLength) {
        this._currentRenderTime = renderTime;
        this.frame += ~~(ellapsedTime / this.frameLength);
        this.frame >= this.frames.length && (this.frame = 0);

        this._useTextureFrame();
      }
    }

    _scope._useTextureFrame = function() {
      this.textureCrop.setRect(this.frames[this.frame]);
    }

    _scope.destruct = function() {
      this.stop();
      _super.destruct.call(this);
    }
  }
);
