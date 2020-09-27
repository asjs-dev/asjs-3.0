require("../NameSpace.js");
require("../utils/agl.Utils.js");
require("../data/props/agl.ColorProps.js");

AGL.RendererHelper = {};

AGL.RendererHelper.initRenderer = function(config) {
  Object.freeze(config);

  this.clearColor = new AGL.ColorProps();

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
};

AGL.RendererHelper.createRendererBody = function(_scope) {
  helpers.get(_scope, "canvas", function() { return this._canvas; });
  helpers.get(_scope, "isContextLost", function() {
    return this._context && this._context.isContextLost && this._context.isContextLost();
  });

  helpers.get(_scope, "context", function() {
    if (!this._context || this.isContextLost) {
      /*
      this._removeListeners();
      this._addListeners();
      */
      this._context = this._canvas.getContext("webgl2", this._config.contextAttributes);
    }
    return this._context;
  });

  helpers.property(_scope, "width", {
    get: function() { return this._width; },
    set: function(v) {
      if (this._width !== v) {
        this._width = v;
        this._resizeUpdateId++;
      }
    }
  });

  helpers.property(_scope, "height", {
    get: function() { return this._height; },
    set: function(v) {
      if (this._height !== v) {
        this._height = v;
        this._resizeUpdateId++;
      }
    }
  });

  _scope.clear = function() {
    var clearColor = this.clearColor;
    clearColor.isUpdated() && this._gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
    this._gl.clear(AGL.Consts.COLOR_BUFFER_BIT);
  }

  _scope.setSize = function(width, height) {
    this.width  = width;
    this.height = height;
  }

  _scope.render = function() {
    this._preRender();
    this._render();
  }

  _scope._preRender = function() {
    this._renderTime = Date.now();
    this._resize();
  }

  _scope._render = helpers.emptyFunction;

  _scope._resizeCanvas = function() {
    if (this._currentResizeUpdateId === this._resizeUpdateId) return false;
    this._currentResizeUpdateId = this._resizeUpdateId;

    this._canvas.width  = this._width;
    this._canvas.height = this._height;

    this._gl.viewport(0, 0, this._gl.drawingBufferWidth, this._gl.drawingBufferHeight);

    return true;
  }

  _scope._resize = _scope._resizeCanvas;

  _scope._destructRenderer = function() {
    //this._removeListeners();

    this._loseContextExt && this._loseContextExt.loseContext();

    this._destructContext();

    this.clearColor      =
    this._gl             =
    this._loseContextExt =
    this._vertexShader   =
    this._fragmentShader =
    this._program        =
    this._locations      =
    this._config         =
    this._canvas         =
    this._loseContextExt =
    this._vertexShader   =
    this._fragmentShader =
    this._program        =
    this._context        = null;
  }
  /*
  _scope._addListeners = function() {
    this._canvas.addEventListener("webglcontextlost",        this._onContextLostBind);
    this._canvas.addEventListener("webglcontextrestored",    this._onContextRestoredBind);
  }

  _scope._removeListeners = function() {
    this._canvas.removeEventListener("webglcontextlost",     this._onContextLostBind);
    this._canvas.removeEventListener("webglcontextrestored", this._onContextRestoredBind);
  }
  */
  _scope._destructContext = function() {
    this._gl.useProgram(null);
    this._gl.detachShader(this._program, this._vertexShader);
    this._gl.deleteShader(this._vertexShader);
    this._gl.detachShader(this._program, this._fragmentShader);
    this._gl.deleteShader(this._fragmentShader);
    this._gl.deleteProgram(this._program);
  }

  _scope._init = function() {
    this._gl = this.context;
    this._loseContextExt = this._gl.getExtension('WEBGL_lose_context');
    this._gl.pixelStorei(AGL.Consts.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    this._gl.enable(AGL.Consts.BLEND);

    this._vertexShader   = AGL.Utils.loadVertexShader(this._gl,   this._config.vertexShader(this._config));
    this._fragmentShader = AGL.Utils.loadFragmentShader(this._gl, this._config.fragmentShader(this._config));
    this._program        = AGL.Utils.createProgram(this._gl, [this._vertexShader, this._fragmentShader]);
    this._locations      = AGL.Utils.getLocationsFor(this._gl, this._program, this._config.locations);
    this._gl.useProgram(this._program);

    var positionBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(AGL.Consts.ARRAY_BUFFER, positionBuffer);
    this._gl.bufferData(
      AGL.Consts.ARRAY_BUFFER,
      new Float32Array([
        0, 0,
        1, 0,
        1, 1,
        0, 1
      ]),
      AGL.Consts.STATIC_DRAW
    );
    this._gl.vertexAttribPointer(this._locations["aPos"], 2, AGL.Consts.FLOAT, false, 0, 0);
    this._gl.enableVertexAttribArray(this._locations["aPos"]);

    this._initCustom();
  }

  _scope._initCustom = helpers.emptyFunction;
  /*
  _scope._onContextLost = function(event) {
    event.preventDefault();

    requestAnimationFrame(function() {
      this._loseContextExt && this._loseContextExt.restoreContext();
    }.bind(this));

  }

  _scope._onContextRestored = function(event) {
    this._init();
  }
  */
};

AGL.RendererHelper.createGetTextureFunction = function(maxTextureImageUnits) {
  var func =
  "vec4 gtTexCol(vec4 col,float id,vec2 crd){";
  for (var i = 0; i < maxTextureImageUnits; i++) {
    func += (i > 0 ? " else " : "") +
    "if(id<" + i + ".5)return texture(uTex[" + i + "],crd);";
  }
  func +=
  "return col;" +
  "}";
  return func;
};

AGL.RendererHelper.Precisons = {
  "HIGH"   : "highp",
  "MEDIUM" : "mediump",
  "LOW"    : "lowp"
};
