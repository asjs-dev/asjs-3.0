require("../../NameSpace.js");
require("./agl.TextureInfo.js");

AGL.Framebuffer = helpers.createPrototypeClass(
  AGL.TextureInfo,
  function Framebuffer(shouldUpdate) {
    AGL.TextureInfo.call(this, shouldUpdate);

    //this.framebuffer = null;

    this._framebufferTempId = AGL.Utils.info.maxTextureImageUnits - 1;
  },
  function(_scope, _super) {
    helpers.property(_scope, "width", {
      get: function() { return this._width; },
      set: function(v) {
        if (this._width !== v && v > 0) {
          this._width = v;
          ++this._updateId;
        }
      }
    });

    helpers.property(_scope, "height", {
      get: function() { return this._height; },
      set: function(v) {
        if (this._height !== v && v > 0) {
          this._height = v;
          ++this._updateId;
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

    _scope.useTexture = function(id) {
      AGL.Utils.bindActiveTexture(this.gl, this, id);
    }

    _scope.isNeedToDraw = function(gl, renderTime) {
      if (this.gl !== gl) {

        this._destroyTexture();
        this.baseTexture = gl.createTexture();

        AGL.Utils.useActiveTexture(gl, this, this._framebufferTempId);

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

        this._loaded = true;

        return true;
      }

      if (this.shouldUpdate && this._currentRenderTime < renderTime) {
        this._currentRenderTime = renderTime;
        return true;
      }

      if (this._currentUpdateId < this._updateId) {
        this._currentUpdateId = this._updateId;
        AGL.Utils.useActiveTexture(gl, this, this._framebufferTempId);
        return true;
      }

      return false;
    }

    _scope._destroyFramebuffer = function() {
      AGL.Utils.destroyFramebuffer(this.gl, this.framebuffer);
    }
  }
);
