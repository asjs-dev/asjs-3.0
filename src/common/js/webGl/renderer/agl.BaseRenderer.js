require("../NameSpace.js");
require("../utils/agl.Context.js");
require("../utils/agl.Buffer.js");
require("../utils/agl.Utils.js");
require("../data/props/agl.ColorProps.js");

AGL.BaseRenderer = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function BaseRenderer(options) {
    helpers.BasePrototypeClass.call(this);

    /*
    this._program          =
    this._width            =
    this._height           =
    this.widthHalf         =
    this.heightHalf        =
    this._gl               = null;
    */

    this._clearBeforeRenderFunc = helpers.emptyFunction;

    this.clearColor = new AGL.ColorProps();

    this._currentContextId =
    this._renderTime       =
    this._resizeId         =
    this._currentResizeId  = 0;

    this._options          = options;
    this._config           = this._options.config;
    this._context          = this._config.context;
    this._config.locations = this._config.locations.concat([
      "uFlpY",
      "aPos",
      "uTex"
    ]);

    this._vao = this._context.gl.createVertexArray();

    this._enableBuffers = false;

    this._elementArrayBuffer = new AGL.Buffer(
      "", new Uint16Array([
        0, 1, 3, 2
      ]),
      0, 0,
      {{AGL.Const.ELEMENT_ARRAY_BUFFER}},
      {{AGL.Const.STATIC_DRAW}}
    );

    this._positionBuffer = new AGL.Buffer(
      "aPos", new F32A([
        0, 0,
        1, 0,
        1, 1,
        0, 1
      ]),
      1, 2,
      {{AGL.Const.ARRAY_BUFFER}},
      {{AGL.Const.STATIC_DRAW}},
      0
    );
  },
  function(_scope, _super) {
    helpers.get(_scope, "context", function() { return this._context; });

    helpers.property(_scope, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v) {
          this._width    = v;
          this.widthHalf = v * .5;
          ++this._resizeId;
        }
      }
    });

    helpers.property(_scope, "height", {
      get: function() { return this._height; },
      set: function(v) {
        if (this._height !== v) {
          this._height    = v;
          this.heightHalf = v * .5;
          ++this._resizeId;
        }
      }
    });

    helpers.property(_scope, "clearBeforeRender", {
      get: function() { return this._clearBeforeRenderFunc === this._clear; },
      set: function(v) {
        this._clearBeforeRenderFunc = v
          ? this._clear
          : helpers.emptyFunction;
      }
    });

    _scope.setSize = function(width, height) {
      this.width  = width;
      this.height = height;
    }

    _scope.renderToFramebuffer = function(framebuffer) {
      if (!this._context.isContextLost) {
        this._switchToProgram();
        this._attachFramebufferAlias(framebuffer);
        this._renderBatch(framebuffer);
        framebuffer.unbind(this._gl);
      }
    }

    _scope.render = function() {
      if (!this._context.isContextLost) {
        this._switchToProgram();
        this._gl.uniform1f(this._locations.uFlpY, 1);
        this._renderBatch();
      }
    }

    _scope._renderBatch = function(framebuffer) {
      this._renderTime = Date.now();
      this._clearBeforeRenderFunc();
      this._render(framebuffer);
      this._gl.flush();
    }

    _scope._switchToProgram = function() {
      this._gl = this._context.gl;

      if (this._currentContextId < this._context.contextId) {
        this._currentContextId = this._context.contextId;
        this._buildProgram();
        this._enableBuffers = true;
      } else if (this._context.useProgram(this._program, this._vao)) this._enableBuffers = true;

      this._resize();
    }

    _scope._attachFramebufferAlias = _scope._attachFramebuffer = function(framebuffer) {
      framebuffer.setSize(this._width, this._height);
      this._context.useTexture(framebuffer, this._renderTime);
      this._context.deactivateTexture(framebuffer);
      framebuffer.bind(this._gl);
      this._clearBeforeRenderFunc();
      this._gl.uniform1f(this._locations.uFlpY, -1);
    }

    _scope._clear = function() {
      var clearColorProps = this.clearColor;
      this._gl.clearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, this.clearColor.a);
      this._gl.clear({{AGL.Const.COLOR_BUFFER_BIT}});
    }

    _scope._resize = function() {
      if (this._context.setSize(this._width, this._height)) ++this._resizeId;
      if (this._currentResizeId < this._resizeId) {
        this._currentResizeId = this._resizeId;
        this._customResize();
      }
    }

    _scope._customResize = helpers.emptyFunction;

    _scope._drawInstanced = function(count) {
      this._gl.drawElementsInstanced({{AGL.Const.TRIANGLE_STRIP}}, 4, {{AGL.Const.UNSIGNED_SHORT}}, 0, count);
    }

    _scope._buildProgram = function() {
      var gl      = this._gl;
      var options = this._options;

      var program = AGL.Utils.createProgram(
        gl,
        this._createVertexShader(options),
        this._createFragmentShader(options)
      );

      this._program = program;

      this._locations = AGL.Utils.getLocationsFor(gl, program, this._config.locations);

      this._context.useProgram(program, this._vao);

      this._createBuffers();
    }

    _scope._uploadBuffers = function() {
      var gl = this._gl;

      this._positionBuffer.upload(gl, true, this._locations);
      this._elementArrayBuffer.upload(gl);

      this._enableBuffers = false;
    }

    _scope._createBuffers = function() {
      var gl = this._gl;

      this._elementArrayBuffer.create(gl);
      this._positionBuffer.create(gl);
    }
  }
);
