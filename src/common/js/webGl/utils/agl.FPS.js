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
      this._targetMS = 0;
      this._then     = 0;
      this._frames   = 0;
      this._prevTime = 0;

      this._then     = (performance || Date).now();
      this._targetMS = 1000 / (targetFPS || 60);

      this.fps   =
      this.delay = 0;
    }

    _scope.update = function() {
      this._frames ++;

      var now = (performance || Date).now();

      this.delay = (now - this._then) / this._targetMS;

      if (now >= this._prevTime + 1000 ) {
        this.fps = (this._frames * 1000) / (now - this._prevTime);

        this._prevTime = now;
        this._frames   = 0;
      }

      this._then = now;
    }
  }
))();
