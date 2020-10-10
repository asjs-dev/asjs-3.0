require("../NameSpace.js");

AGL.TextureInfo = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function TextureInfo(shouldUpdate) {
    helpers.BasePrototypeClass.call(this);

    this.target = AGL.Consts.TEXTURE_2D;

    this.maxLevel = 5;

    this.shouldUpdate   = shouldUpdate;
    this.generateMipmap = false;

    this.baseTexture =
    this.gl          = null;

    this.wrapS =
    this.wrapT = AGL.Consts.CLAMP_TO_EDGE;

    this.internalFormat =
    this.format         = AGL.Consts.RGBA;

    this._minFilter       =
    this._mipmapMinFilter =
    this.magFilter        = AGL.Consts.NEAREST;

    this._width             =
    this._height            =
    this._currentRenderTime = 0;
  },
  function(_scope, _super) {
    helpers.get(_scope, "width",  function() { return this._width; });
    helpers.get(_scope, "height", function() { return this._height; });

    helpers.get(_scope, "mipmapMinFilter", function() { return this._mipmapMinFilter; });

    helpers.property(_scope, "minFilter", {
      get: function() { return this._minFilter; },
      set: function(v) { this._minFilter = v; }
    });

    helpers.get(_scope, "source", function() { return null; });

    _scope.isNeedToDraw = function(gl, renderTime) {
      if (this.gl !== gl) {
        this._destroyTexture();

        this.baseTexture = gl.createTexture();
        this.gl          = gl;

        return true;
      }

      if (this.shouldUpdate) {
        var shouldUpdate = this._currentRenderTime < renderTime;
        this._currentRenderTime = renderTime;
        return shouldUpdate;
      }
      
      return false;
    }

    _scope.destruct = function() {
      this._destroyTexture();

      _super.destruct.call(this);
    }

    _scope._destroyTexture = function() {
      this.gl && this.baseTexture && AGL.Utils.destroyTexture(this.gl, this);
    }
  }
);
