require("../NameSpace.js");

AGL.Context = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function Context(config) {
    helpers.BasePrototypeClass.call(this);

    /*
    this._currentProgram   =
    this._currentBlendMode =
    this.width             =
    this.height            = null;
    */

    this.contextId = 0;

    this._config = AGL.Utils.initContextConfig(config || {});
    this._canvas = this._config.canvas;

    this._MAX_TEXTURE_NUM = AGL.Utils.info.maxTextureImageUnits;

    this._onContextLostBound     = this._onContextLost.bind(this);
    this._onContextRestoredBound = this._initContext.bind(this);
    this._restoreContextBound    = this._restoreContext.bind(this);

    this._canvas.addEventListener("webglcontextlost",     this._onContextLostBound);
    this._canvas.addEventListener("webglcontextrestored", this._onContextRestoredBound);

    this._initContext();
  },
  function(_scope, _super) {
    helpers.get(_scope, "canvas",        function() { return this._canvas; });
    helpers.get(_scope, "isContextLost", function() { return this.gl && this.gl.isContextLost && this.gl.isContextLost(); });

    _scope.useBlendMode = function(blendMode) {
      this._currentBlendMode = blendMode;

      var eqs   = blendMode.eqs;
      var funcs = blendMode.funcs;

      this.gl[blendMode.eqName](
        eqs[0],
        eqs[1]
      );

      this.gl[blendMode.funcName](
        funcs[0],
        funcs[1],
        funcs[2],
        funcs[3]
      );
    }

    _scope.setBlendMode = function(blendMode, drawCallback) {
      if (this._currentBlendMode !== blendMode) {
        drawCallback && drawCallback();
        this.useBlendMode(blendMode);
      }
    }

    _scope.destruct = function() {
      this.gl.useProgram(null);

      this._canvas.removeEventListener("webglcontextlost",     this._onContextLostBound);
      this._canvas.removeEventListener("webglcontextrestored", this._onContextRestoredBound);

      this._loseContextExt && this._loseContextExt.loseContext();

      _super.destruct.call(this);
    }

    _scope.clearTextures = function() {
      for (var i = 0; i < this._MAX_TEXTURE_NUM; ++i) {
        this._textureMap[i]        = null;
        this._emptyTextureSlots[i] = i;
      }

      this.textureIds.length  = 0;
    }

    _scope.useTexture = function(textureInfo, renderTime, forceBind, callback) {
      if (!textureInfo) return -1;

      var textureId = this._textureMap.indexOf(textureInfo);
      if (textureId < 0) {
        textureId = this._emptyTextureSlots[0];
        forceBind = true;
      }

      if (this._emptyTextureSlots.length < 1) {
        callback && callback();
        this.clearTextures();
        textureId = 0;
        forceBind = true;
      }

      return this.useTextureAt(textureInfo, textureId, renderTime, forceBind);
    }

    _scope.useTextureAt = function(textureInfo, textureId, renderTime, forceBind) {
      if (!textureInfo) return -1;

      textureInfo.use(this.gl, textureId, renderTime, forceBind);

      this._textureMap[textureId] = textureInfo;

      var textureIdIndex = this.textureIds.indexOf(textureId);
      textureIdIndex < 0 && this.textureIds.push(textureId);

      var emptyTextureId = this._emptyTextureSlots.indexOf(textureId);
      emptyTextureId > -1 && this._emptyTextureSlots.splice(emptyTextureId, 1);

      return textureId;
    }

    _scope.deactivateTexture = function(textureInfo) {
      var textureId = textureInfo ? this._textureMap.indexOf(textureInfo) : -1;
      textureId > -1 && textureInfo.unbindTexture(this.gl, textureId);
    }

    _scope.useProgram = function(program) {
      if (this._currentProgram !== program) {
        this._currentProgram = program;
        this.clearTextures();
        this.gl.useProgram(program);
        return true;
      }
      return false;
    }

    _scope._onContextLost = function(event) {
      event.preventDefault();
      this._loseContextExt && setTimeout(this._restoreContextBound, 1);
    }

    _scope._restoreContext = function() {
      this._loseContextExt.restoreContext();
    }

    _scope._initContext = function() {
      ++this.contextId;

      var gl = this.gl = this._canvas.getContext("webgl2", this._config.contextAttributes);

      gl.agl_id = this.contextId;

      this._loseContextExt = gl.getExtension('WEBGL_lose_context');

      gl.pixelStorei({{AGL.Const.UNPACK_PREMULTIPLY_ALPHA_WEBGL}}, true);
      gl.enable({{AGL.Const.BLEND}});
      gl.enable({{AGL.Const.SCISSOR_TEST}});

      this._textureMap = [];
      this._emptyTextureSlots = [];
      this.textureIds  = [];

      this.clearTextures();
    }

    _scope.setCanvasSize = function(width, height) {
      this._canvas.width  !== width  && (this._canvas.width  = width);
      this._canvas.height !== height && (this._canvas.height = height);
    }

    _scope.setSize = function(width, height) {
      if (this.width !== width || this.height !== height) {
        this.width  = width;
        this.height = height;

        this.gl.scissor(0, 0, width, height);
        this.gl.viewport(0, 0, width, height);

        return true;
      }
      return false;
    }
  }
);
