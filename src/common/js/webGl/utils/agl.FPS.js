require("../NameSpace.js");

AGL.FPS = new (helpers.createPrototypeClass(
  Object,
  function FPS() {
    /*
    this._targetFPS
    this._then
    this.delay
    */
    this.fps = 0;
  },
  function(_scope) {
    _scope.start = function(targetFPS) {
      this._targetMS = 1000 / (targetFPS || 60);
      this._then     = Date.now();
    }

    _scope.update = function() {
      var now      = Date.now();
      var duration = (now - this._then);

      this.fps   = (this.fps + (1000 / duration)) / 2;
      this.delay = duration / this._targetMS;
      this._then = now;
    }
  }
))();
