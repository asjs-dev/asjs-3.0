require("../NameSpace.js");
require("../data/agl.TextureInfo.js");

AGL.Framebuffer = helpers.createPrototypeClass(
  AGL.TextureInfo,
  function Framebuffer(shouldUpdate) {
    AGL.TextureInfo.call(this, shouldUpdate);

    this.framebuffer = null;
  },
  function(_scope, _super) {
    _scope.destruct = function() {
      this._destroyFramebuffer();

      this.framebuffer = null;

      _super.destruct.call(this);
    }

    _scope.isNeedToDraw = function(gl, width, height) {
      if ((this.gl !== gl || this._width !== width || this._height !== height) && width > 0 && height > 0) {
        this._width  = width;
        this._height = height;

        this._destroyTexture();
        this.baseTexture = gl.createTexture();

        AGL.Utils.useTexture(gl, 0, this);

        this._destroyFramebuffer();
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(AGL.Consts.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(
          AGL.Consts.FRAMEBUFFER,
          AGL.Consts.COLOR_ATTACHMENT0,
          AGL.Consts.TEXTURE_2D,
          this.baseTexture,
          0
        );

        this.gl = gl;

        return true;
      }
      return false;
    }

    _scope._destroyFramebuffer = function() {
      this.gl && this.framebuffer && AGL.Utils.destroyFramebuffer(this.gl, this.framebuffer);
    }
  }
);
