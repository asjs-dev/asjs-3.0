require("../../NameSpace.js");
require("./agl.TextureInfo.js");

AGL.Framebuffer = helpers.createPrototypeClass(
  AGL.TextureInfo,
  function Framebuffer() {
    AGL.TextureInfo.call(this, false);

    //this._framebuffer = null;
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

    _scope.bind = function(gl) {
      gl.bindFramebuffer({{AGL.Const.FRAMEBUFFER}}, this._framebuffer);
    }

    _scope.unbind = function(gl) {
      gl.bindFramebuffer({{AGL.Const.FRAMEBUFFER}}, null);
    }

    _scope.use = function(gl, id) {
      !this._update(gl, id) && this._currenActivetId !== id && this._use(gl, id);
    }

    _scope._use = function(gl, id) {
      this.activeTexture(gl, id);
      gl.bindTexture(this.target, this._baseTexture);
    }

    _scope._update = function(gl, id) {
      var result = false;

      if (this._currentAglId < gl.agl_id) {
        this._currentAglId = gl.agl_id;

        this._framebuffer = gl.createFramebuffer();

        this._baseTexture = gl.createTexture();

        this.useActiveTexture(gl, id);

        this.bind(gl);

        gl.framebufferTexture2D(
          {{AGL.Const.FRAMEBUFFER}},
          {{AGL.Const.COLOR_ATTACHMENT0}},
          {{AGL.Const.TEXTURE_2D}},
          this._baseTexture,
          0
        );

        this.unbind(gl);

        result = true;
      }

      if (this._currentUpdateId < this._updateId) {
        this._currentUpdateId = this._updateId;
        this.useActiveTexture(gl, id);
        result = true;
      }

      return result;
    }
  }
);
