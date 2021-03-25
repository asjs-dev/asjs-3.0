require("../NameSpace.js");

AGL.FPS = new (helpers.createPrototypeClass(
  Object,
  function FPS() {
    /*
    this.fps
    this.delay
    this._targetFPS
    this._then
    */
  },
  function(_scope) {
    _scope.start = function(targetFPS) {
      this.fps      =
      this._fps     = 0;
      this._counter = 0;

      this._targetMS = 1000 / (targetFPS || 60);
      this._then     = Date.now();
    }

    _scope.update = function() {
      var now      = Date.now();
      var duration = now - this._then;

      this._fps += 1000 / duration;
      this.fps   = this._fps / ++this._counter;
      if (this._counter > 59) {
        this._fps     =
        this._counter = 0;
      }
      this.delay = duration / this._targetMS;
      this._then = now;
    }
  }
))();
