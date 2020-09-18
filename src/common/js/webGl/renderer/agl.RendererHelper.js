require("../NameSpace.js");
require("../utils/agl.Utils.js");

AGL.RendererHelper = {
  "init": function(canvas) {
    this._width  =
    this._height = 0;

    this._resizeUpdateId        = 0;
    this._currentResizeUpdateId = -1;

    this._canvas = canvas;

    this._renderTime = 0;

    this._context = null;

    this._gl = this.context;

    this._gl.pixelStorei(this._gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    this._gl.enable(this._gl.BLEND);
  },
  "createFunctionality": function(canvas) {
    get(this, "canvas", function() { return this._canvas; });

    get(this, "context", function() {
      if (!this._context || (this._context.isContextLost && this._context.isContextLost())) {
        this._canvas.addEventListener("webglcontextlost", function(event) { console.log(event); });
        this._canvas.addEventListener("webglcontextrestored", function(event) { console.log(event); });
        this._canvas.addEventListener("webglcontextcreationerror", function(event) { console.log(event); });

        this._context = this._canvas.getContext(
          "webgl2",
          this._config.contextAttributes
        );
      }
      return this._context;
    });

    prop(this, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v) {
          this._width = v;
          this._resizeUpdateId++;
        }
      }
    });

    prop(this, "height", {
      get: function() { return this._height; },
      set: function(v) {
        if (this._height !== v) {
          this._height = v;
          this._resizeUpdateId++;
        }
      }
    });

    this.setSize = function(width, height) {
      this.width  = width;
      this.height = height;
    }

    this.render = function() {
      this._preRender();
      this._render();
    }

    this._preRender = function() {
      this._renderTime = Date.now();
      this._resize();
    }

    this._render = function() {}

    this._resizeCanvas = function() {
      if (this._resizeUpdateId === this._currentResizeUpdateId) return false;
      this._currentResizeUpdateId = this._resizeUpdateId;

      this._canvas.width  = this._width;
      this._canvas.height = this._height;

      this._gl.viewport(0, 0, this._gl.drawingBufferWidth, this._gl.drawingBufferHeight);

      return true;
    }

    this._resize = this._resizeCanvas;
  }
}
