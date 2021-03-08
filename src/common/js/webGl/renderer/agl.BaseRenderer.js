require("../NameSpace.js");
require("../utils/agl.Utils.js");
require("../data/props/agl.ColorProps.js");

AGL.BaseRenderer = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function BaseRenderer(config) {
    helpers.BasePrototypeClass.call(this);

    /*
    this._vertexShader     =
    this._fragmentShader   =
    this._program          =
    this._context          = null;
    this._currentBlendMode = null;
    */

    this.clearColor = new AGL.ColorProps();

    this.width                      =
    this.height                     = 1;

    this.widthHalf                  =
    this.heightHalf                 =
    this._renderTime                =
    this._currentClearColorUpdateId = 0;

    this._resizeFunc = this._resize;

    this._config = config;
    this._canvas = config.canvas;

    this._init();
  },
  function(_scope) {
    helpers.get(_scope, "canvas", function() { return this._canvas; });
    helpers.get(_scope, "isContextLost", function() {
      return this._context && this._context.isContextLost && this._context.isContextLost();
    });

    helpers.get(_scope, "context", function() {
      if (!this._context || this.isContextLost)
        this._context = this._canvas.getContext("webgl2", this._config.contextAttributes);
      return this._context;
    });

    helpers.property(_scope, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v) {
          this._width = v;
          this._resizeFunc = this._resize;
        }
      }
    });

    helpers.property(_scope, "height", {
      get: function() { return this._height; },
      set: function(v) {
        if (this._height !== v) {
          this._height = v;
          this._resizeFunc = this._resize;
        }
      }
    });

    _scope.clear = function() {
      var clearColorProps = this.clearColor;
      if (this._currentClearColorUpdateId < clearColorProps.updateId) {
        this._gl.useProgram(this._program);
        this._currentClearColorUpdateId = clearColorProps.updateId;
        this._gl.clearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, this.clearColor.a);
      }
      this._gl.clear({{AGL.Const.COLOR_BUFFER_BIT}});
    }

    _scope.setSize = function(width, height) {
      this.width  = width;
      this.height = height;
    }

    _scope.renderToTexture = function(framebuffer) {
      this._gl.useProgram(this._program);
      this._attachFramebuffer(framebuffer);
      this._renderBatch(framebuffer);
      AGL.Utils.unbindFrameBuffer(this._gl);
    }

    _scope.render = function(framebuffer) {
      this._gl.useProgram(this._program);
      this._gl.uniform1f(this._locations.uFlpY, 1);
      this._renderBatch();
    }

    _scope._renderBatch = function(framebuffer) {
      this._renderTime = Date.now();
      this._resizeFunc();
      this._useBlendMode(AGL.BlendMode.NORMAL);
      this._render(framebuffer);
    }

    _scope._attachFramebuffer = function(framebuffer) {
      framebuffer.setSize(this.width, this.height);
      framebuffer.isNeedToDraw(this._gl, this._renderTime);
      AGL.Utils.bindFrameBuffer(this._gl, framebuffer);
      this._gl.uniform1f(this._locations.uFlpY, -1);
    }

    _scope._useBlendMode = function(blendMode) {
      this._currentBlendMode = blendMode;

      var eqs   = blendMode.eqs;
      var funcs = blendMode.funcs;

      this._gl[blendMode.eqName](
        eqs[0],
        eqs[1]
      );

      this._gl[blendMode.funcName](
        funcs[0],
        funcs[1],
        funcs[2],
        funcs[3]
      );
    }

    _scope._resize = function() {
      this._resizeFunc = helpers.emptyFunction;

      this.widthHalf  = this._width  * .5;
      this.heightHalf = this._height * .5;

      this._setCanvasSize(this._width, this._height);
    }

    _scope._setCanvasSize = function(width, height) {
      this._canvas.width  = width;
      this._canvas.height = height;

      this._gl.viewport(0, 0, width, height);
    }

    _scope.destruct = function() {
      this._destructContext();

      this.clearColor        =
      this._gl               =
      this._vertexShader     =
      this._fragmentShader   =
      this._program          =
      this._locations        =
      this._config           =
      this._canvas           =
      this._context          =
      this._currentBlendMode = null;
    }

    _scope._destructContext = function() {
      this._gl.useProgram(null);
      this._gl.detachShader(this._program, this._vertexShader);
      this._gl.deleteShader(this._vertexShader);
      this._gl.detachShader(this._program, this._fragmentShader);
      this._gl.deleteShader(this._fragmentShader);
      this._gl.deleteProgram(this._program);

      this._loseContextExt && this._loseContextExt.loseContext();
    }

    _scope._createArrayBuffer = function(data, locationId, length, num, size, type, bytes) {
      var buffer = this._gl.createBuffer();

      this._gl.bindBuffer({{AGL.Const.ARRAY_BUFFER}}, buffer);
  		this._gl.bufferData({{AGL.Const.ARRAY_BUFFER}}, data.byteLength, {{AGL.Const.DYNAMIC_DRAW}});

      this._attachArrayBuffer(this._locations[locationId], buffer, data, length, num, size, type, bytes);

      return buffer;
    }

    _scope._attachArrayBuffer = function(location, buffer, data, length, num, size, type, bytes) {
      this._bindArrayBuffer(buffer, data);

  		var stride = bytes * length;
      var i = num + 1;
      while (--i) {
  			var loc = location + (num - i);
  			this._gl.enableVertexAttribArray(loc);

        this._gl[
          "vertexAttrib" + (
            type === {{AGL.Const.FLOAT}}
            ? ""
            : "I"
          ) + "Pointer"
        ](loc, size, type, false, stride, (num - i) * bytes * size);
  			this._gl.vertexAttribDivisor(loc, 1);
  		}
  	}

    _scope._bindArrayBuffer = function(buffer, data) {
      this._gl.bindBuffer({{AGL.Const.ARRAY_BUFFER}}, buffer);
  		this._gl.bufferSubData({{AGL.Const.ARRAY_BUFFER}}, 0, data);
    }

    _scope._init = function() {
      this._gl = this.context;

      this._loseContextExt = this._gl.getExtension('WEBGL_lose_context');

      this._gl.pixelStorei({{AGL.Const.UNPACK_PREMULTIPLY_ALPHA_WEBGL}}, true);
      this._gl.enable({{AGL.Const.BLEND}});

      this._vertexShader   = AGL.Utils.loadVertexShader(this._gl,   this._config.vertexShader(this._config));
      this._fragmentShader = AGL.Utils.loadFragmentShader(this._gl, this._config.fragmentShader(this._config));
      this._program        = AGL.Utils.createProgram(this._gl, [this._vertexShader, this._fragmentShader]);
      this._locations      = AGL.Utils.getLocationsFor(this._gl, this._program, this._config.locations);

      this._gl.useProgram(this._program);

      var positionBuffer = this._gl.createBuffer();
      this._gl.bindBuffer({{AGL.Const.ARRAY_BUFFER}}, positionBuffer);
      this._gl.bufferData(
        {{AGL.Const.ARRAY_BUFFER}},
        new F32A([
          0, 0,
          1, 0,
          1, 1,
          0, 1
        ]),
        {{AGL.Const.STATIC_DRAW}}
      );
      this._gl.vertexAttribPointer(this._locations.aPos, 2, {{AGL.Const.FLOAT}}, false, 0, 0);
      this._gl.enableVertexAttribArray(this._locations.aPos);

      this._initCustom();
    }
  }
);
