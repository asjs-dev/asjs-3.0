require("../../NameSpace.js");
require("./agl.TextureInfo.js");

AGL.Framebuffer = helpers.createPrototypeClass(
  AGL.TextureInfo,
  function Framebuffer(shouldUpdate) {
    AGL.TextureInfo.call(this, shouldUpdate);

    this.framebuffer = null;

    this._sizeUpdateId         =
    this._currentSizeUpdatedId = 0;

    this._loaded = true;
  },
  function(_scope, _super) {
    helpers.property(_scope, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v && v > 0) {
          this._width = v;
          ++this._sizeUpdateId;
        }
      }
    });

    helpers.property(_scope, "height", {
      get: function() { return this._height; },
      set: function(v) {
        if (this._height !== v && v > 0) {
          this._height = v;
          ++this._sizeUpdateId;
        }
      }
    });

    _scope.setSize = function(w, h) {
      this.width  = w;
      this.height = h;
    }

    _scope.destruct = function() {
      this._destroyFramebuffer();

      _super.destruct.call(this);
    }

    _scope.isNeedToDraw = function(gl, renderTime) {
      if (this.gl !== gl || this._currentSizeUpdatedId < this._sizeUpdateId) {
        this._currentSizeUpdatedId = this._sizeUpdateId;

        this._destroyTexture();
        this.baseTexture = gl.createTexture();

        AGL.Utils.useTexture(gl, 0, this);

        this._destroyFramebuffer();
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer({{AGL.Const.FRAMEBUFFER}}, this.framebuffer);
        gl.framebufferTexture2D(
          {{AGL.Const.FRAMEBUFFER}},
          {{AGL.Const.COLOR_ATTACHMENT0}},
          {{AGL.Const.TEXTURE_2D}},
          this.baseTexture,
          0
        );

        this.gl = gl;

        return true;
      }
      return false;
    }

    _scope._destroyFramebuffer = function() {
      AGL.Utils.destroyFramebuffer(this.gl, this.framebuffer);
    }
  }
);
