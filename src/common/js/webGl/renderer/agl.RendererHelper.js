require("../NameSpace.js");
require("../utils/agl.Utils.js");

AGL.RendererHelper = {
  "init": function(config) {
    Object.freeze(config);

    this._width                 =
    this._height                =
    this._resizeUpdateId        =
    this._currentResizeUpdateId =
    this._renderTime            = 0;

    this._config = config;
    this._canvas = config.canvas;


    this._loseContextExt =
    this._vertexShader   =
    this._fragmentShader =
    this._program        =
    this._context        = null;
    /*
    this._onContextLostBind     = this._onContextLost.bind(this);
    this._onContextRestoredBind = this._onContextRestored.bind(this);
    */
    this._init();
  },
  "createFunctionality": function() {
    helpers.get(this, "canvas", function() { return this._canvas; });
    helpers.get(this, "isContextLost", function() {
      return this._context && this._context.isContextLost && this._context.isContextLost();
    });

    helpers.get(this, "context", function() {
      if (!this._context || this.isContextLost) {
        /*
        this._removeListeners();
        this._addListeners();
        */
        this._context = this._canvas.getContext("webgl2", this._config.contextAttributes);
      }
      return this._context;
    });

    helpers.property(this, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v) {
          this._width = v;
          this._resizeUpdateId++;
        }
      }
    });

    helpers.property(this, "height", {
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

    this._render = helpers.emptyFunction;

    this._resizeCanvas = function() {
      if (this._currentResizeUpdateId === this._resizeUpdateId) return false;
      this._currentResizeUpdateId = this._resizeUpdateId;

      this._canvas.width  = this._width;
      this._canvas.height = this._height;

      this._gl.viewport(0, 0, this._gl.drawingBufferWidth, this._gl.drawingBufferHeight);

      return true;
    }

    this._resize = this._resizeCanvas;

    this._destructRenderer = function() {
      //this._removeListeners();
      this._destructContext();
      this._loseContextExt && this._loseContextExt.loseContext();
    }
    /*
    this._addListeners = function() {
      this._canvas.addEventListener("webglcontextlost",        this._onContextLostBind);
      this._canvas.addEventListener("webglcontextrestored",    this._onContextRestoredBind);
    }

    this._removeListeners = function() {
      this._canvas.removeEventListener("webglcontextlost",     this._onContextLostBind);
      this._canvas.removeEventListener("webglcontextrestored", this._onContextRestoredBind);
    }
    */
    this._destructContext = function() {
      this._gl.useProgram(null);
      this._gl.detachShader(this._program, this._vertexShader);
      this._gl.deleteShader(this._vertexShader);
      this._gl.detachShader(this._program, this._fragmentShader);
      this._gl.deleteShader(this._fragmentShader);
      this._gl.deleteProgram(this._program);
    }

    this._init = function() {
      this._gl = this.context;
      this._loseContextExt = this._gl.getExtension('WEBGL_lose_context');
      this._gl.pixelStorei(this._gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      this._gl.enable(this._gl.BLEND);

      this._vertexShader   = AGL.Utils.loadVertexShader(this._gl,   this._config.vertexShader(this._config));
      this._fragmentShader = AGL.Utils.loadFragmentShader(this._gl, this._config.fragmentShader(this._config));
      this._program        = AGL.Utils.createProgram(this._gl, [this._vertexShader, this._fragmentShader]);
      this._locations      = AGL.Utils.getLocationsFor(this._gl, this._program, this._config.locations);
      this._gl.useProgram(this._program);

      var positionBuffer = this._gl.createBuffer();
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionBuffer);
      this._gl.bufferData(
        this._gl.ARRAY_BUFFER,
        new Float32Array([
          0, 0,
          1, 0,
          1, 1,
          0, 1
        ]),
        this._gl.STATIC_DRAW
      );
      this._gl.vertexAttribPointer(this._locations["aPos"], 2, this._gl.FLOAT, false, 0, 0);
      this._gl.enableVertexAttribArray(this._locations["aPos"]);

      this._initCustom();
    }

    this._initCustom = helpers.emptyFunction;
    /*
    this._onContextLost = function(event) {
      event.preventDefault();

      requestAnimationFrame(function() {
        this._loseContextExt && this._loseContextExt.restoreContext();
      }.bind(this));

    }

    this._onContextRestored = function(event) {
      this._init();
    }
    */
  }
}
