require("../NameSpace.js");
require("../utils/agl.Utils.js");

AGL.RendererHelper = {
  "init": function(canvas) {
    this._w  = 0;
    this._h = 0;

    this._resUpdId = 0;
    this._curResUpdId = -1;

    this._cnvs = canvas;

    this._context = null;

    this._gl = this.context;

    this._gl.pixelStorei(this._gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    this._gl.enable(this._gl.BLEND);
  },
  "createFunctionality": function(canvas) {
    get(this, "canvas", function() { return this._cnvs; });

    get(this, "context", function() {
      if (!this._context || (this._context.isContextLost && this._context.isContextLost())) {
        this._cnvs.addEventListener("webglcontextlost", function(event) { console.log(event); });
        this._cnvs.addEventListener("webglcontextrestored", function(event) { console.log(event); });
        this._cnvs.addEventListener("webglcontextcreationerror", function(event) { console.log(event); });

        this._context = this._cnvs.getContext(
          "webgl2",
          this._config.contextAttributes
        );
      }
      return this._context;
    });

    prop(this, "width", {
      get: function() { return this._w; },
      set: function(v) {
        if (this._w !== v) {
          this._w = v;
          this._resUpdId++;
        }
      }
    });

    prop(this, "height", {
      get: function() { return this._h; },
      set: function(v) {
        if (this._h !== v) {
          this._h = v;
          this._resUpdId++;
        }
      }
    });

    this.setSize = function(width, height) {
      this.width  = width;
      this.height = height;
    }

    this.render = function() {
      this._rsz();
      this._rndr();
    }

    this._rndr = function() {}

    this._rszCanvas = function() {
      if (this._resUpdId === this._curResUpdId) return false;
      this._curResUpdId = this._resUpdId;

      this._cnvs.width  = this._w;
      this._cnvs.height = this._h;

      this._gl.viewport(0, 0, this._gl.drawingBufferWidth, this._gl.drawingBufferHeight);

      return true;
    }

    this._rsz = this._rszCanvas;
  }
}
