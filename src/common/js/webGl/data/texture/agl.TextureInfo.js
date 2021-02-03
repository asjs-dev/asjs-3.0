require("../../NameSpace.js");

AGL.TextureInfo = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function TextureInfo(shouldUpdate) {
    helpers.BasePrototypeClass.call(this);

    /*
    this._loaded     = false;
    this.baseTexture =
    this.gl          = null;
    */

    this.target = {{AGL.Const.TEXTURE_2D}};

    this.shouldUpdate = shouldUpdate;

    this._updateId          =
    this._currentUpdateId   =
    this._currentRenderTime = 0;

    this.wrapS =
    this.wrapT = {{AGL.Const.CLAMP_TO_EDGE}};

    this.internalFormat =
    this.format         = {{AGL.Const.RGBA}};

    this.minFilter =
    this.magFilter = {{AGL.Const.NEAREST}};

    this._width  =
    this._height = 1;
  },
  function(_scope, _super) {
    helpers.get(_scope, "loaded", function() { return this._loaded; });
    helpers.get(_scope, "width",  function() { return this._width; });
    helpers.get(_scope, "height", function() { return this._height; });

    helpers.get(_scope, "minMipmapFilter", function() { return this._minMipmapFilter; });

    helpers.property(_scope, "minFilter", {
      get: function() { return this._minFilter; },
      set: function(v) {
        if (this._minFilter !== v) {
          this._minFilter = v;
          this._minMipmapFilter = this._minFilter === {{AGL.Const.LINEAR}}
              ? {{AGL.Const.LINEAR_MIPMAP_LINEAR}}
              : {{AGL.Const.NEAREST_MIPMAP_NEAREST}};
        }
      }
    });

    _scope.isNeedToDraw = function(gl, renderTime) {
      if (this.gl !== gl) {
        this._destroyTexture();

        this.baseTexture = gl.createTexture();
        this.gl          = gl;

        return true;
      }

      if (this.shouldUpdate && this._currentRenderTime < renderTime) {
        this._currentRenderTime = renderTime;
        return true;
      }

      if (this._currentUpdateId < this._updateId) {
        this._currentUpdateId = this._updateId;
        return true;
      }

      return false;
    }

    _scope.destruct = function() {
      this._destroyTexture();

      _super.destruct.call(this);
    }

    _scope._destroyTexture = function() {
      AGL.Utils.destroyTexture(this.gl, this);
    }
  }
);
