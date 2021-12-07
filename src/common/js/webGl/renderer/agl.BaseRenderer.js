import helpers from "../../helpers/NameSpace.js";
import "../NameSpace.js";
import "../utils/agl.Context.js";
import "../utils/agl.Buffer.js";
import "../utils/agl.Utils.js";
import "../data/props/agl.ColorProps.js";

AGL.BaseRenderer = class {
  constructor(options) {
    /*
    this._program
    this._width
    this._height
    this.widthHalf
    this.heightHalf
    this._gl
    */

    this._attachFramebufferAlias = this._attachFramebuffer;

    this._clearBeforeRenderFunc = helpers.emptyFunction;

    this.clearColor = new AGL.ColorProps();

    this._currentContextId =
    this._renderTime =
    this._resizeId =
    this._currentResizeId = 0;

    this._options = options;
    this._config = this._options.config;
    this._context = this._config.context;
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
      AGL.Const.ELEMENT_ARRAY_BUFFER,
      AGL.Const.STATIC_DRAW
    );

    this._positionBuffer = new AGL.Buffer(
      "aPos", new Float32Array([
        0, 0,
        1, 0,
        1, 1,
        0, 1
      ]),
      1, 2,
      AGL.Const.ARRAY_BUFFER,
      AGL.Const.STATIC_DRAW,
      0
    );
  }

  get context() { return this._context; }

  get width() { return this._width; }
  set width(v) {
    if (this._width !== v) {
      this._width = v;
      this.widthHalf = v * .5;
      ++this._resizeId;
    }
  }

  get height() { return this._height; }
  set height(v) {
    if (this._height !== v) {
      this._height = v;
      this.heightHalf = v * .5;
      ++this._resizeId;
    }
  }

  get clearBeforeRender() { return this._clearBeforeRenderFunc === this._clear; }
  set clearBeforeRender(v) {
    this._clearBeforeRenderFunc = v
      ? this._clear
      : helpers.emptyFunction;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
  }

  renderToFramebuffer(framebuffer) {
    if (!this._context.isLost()) {
      this._switchToProgram();
      this._attachFramebufferAlias(framebuffer);
      this._renderBatch(framebuffer);
      framebuffer.unbind(this._gl);
    }
  }

  render() {
    if (!this._context.isLost()) {
      this._switchToProgram();
      this._gl.uniform1f(this._locations.uFlpY, 1);
      this._renderBatch();
    }
  }

  destruct() {}

  _renderBatch(framebuffer) {
    this._renderTime = Date.now();
    this._clearBeforeRenderFunc();
    this._render(framebuffer);
    this._gl.flush();
  }

  _switchToProgram() {
    this._gl = this._context.gl;

    if (this._currentContextId < this._context.contextId) {
      this._currentContextId = this._context.contextId;
      this._buildProgram();
      this._enableBuffers = true;
    } else if (this._context.useProgram(this._program, this._vao))
      this._enableBuffers = true;

    this._resize();
  }

  _attachFramebuffer(framebuffer) {
    framebuffer.setSize(this._width, this._height);
    this._context.useTexture(framebuffer, this._renderTime);
    this._context.deactivateTexture(framebuffer);
    framebuffer.bind(this._gl);
    this._clearBeforeRenderFunc();
    this._gl.uniform1f(this._locations.uFlpY, -1);
  }

  _clear() {
    this._gl.clearColor(
      this.clearColor.r,
      this.clearColor.g,
      this.clearColor.b,
      this.clearColor.a
    );
    this._gl.clear(AGL.Const.COLOR_BUFFER_BIT);
  }

  _resize() {
    if (this._context.setSize(this._width, this._height))
      ++this._resizeId;
    if (this._currentResizeId < this._resizeId) {
      this._currentResizeId = this._resizeId;
      this._customResize();
    }
  }

  _customResize() {}

  _drawInstanced(count) {
    this._gl.drawElementsInstanced(
      AGL.Const.TRIANGLE_STRIP,
      4,
      AGL.Const.UNSIGNED_SHORT,
      0,
      count
    );
  }

  _buildProgram() {
    const options = this._options;

    const program = AGL.Utils.createProgram(
      this._gl,
      this._createVertexShader(options),
      this._createFragmentShader(options)
    );

    this._program = program;

    this._locations = AGL.Utils.getLocationsFor(
      this._gl,
      program,
      this._config.locations
    );

    this._context.useProgram(program, this._vao);

    this._createBuffers();
  }

  _uploadBuffers() {
    this._positionBuffer.upload(this._gl, true, this._locations);
    this._elementArrayBuffer.upload(this._gl);

    this._enableBuffers = false;
  }

  _createBuffers() {
    this._elementArrayBuffer.create(this._gl);
    this._positionBuffer.create(this._gl);
  }
}
