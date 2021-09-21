require("../../NameSpace.js");

AGL.TextureInfo = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function TextureInfo() {
    helpers.BasePrototypeClass.call(this);

    /*
    this._baseTexture  =
    */

    this.target = {{AGL.Const.TEXTURE_2D}};

    this._currenActivetId = -1;
    this._currentAglId    =
    this._updateId        =
    this._currentUpdateId = 0;

    this.renderSource = null;

    this.wrapS =
    this.wrapT = {{AGL.Const.CLAMP_TO_EDGE}};

    this.internalFormat =
    this.format         = {{AGL.Const.RGBA}};

    this.minFilter =
    this.magFilter = {{AGL.Const.NEAREST}};

    this._width  =
    this._height = 1;

    this.type = {{AGL.Const.UNSIGNED_BYTE}};
  },
  function(_scope, _super) {
    helpers.get(_scope, "width",  function() { return this._width; });
    helpers.get(_scope, "height", function() { return this._height; });

    helpers.get(_scope, "minMipmapFilter", function() { return this._minMipmapFilter; });

    helpers.property(_scope, "minFilter", {
      get: function() { return this._minFilter; },
      set: function(v) {
        if (this._minFilter !== v) {
          this._minFilter = v;
          this._minMipmapFilter = v === {{AGL.Const.LINEAR}}
              ? {{AGL.Const.LINEAR_MIPMAP_LINEAR}}
              : {{AGL.Const.NEAREST_MIPMAP_NEAREST}};
        }
      }
    });

    _scope.useActiveTexture = function(gl, id) {
      this.activeTexture(gl, id);
      this.useTexture(gl);
    }

    _scope.unbindTexture = function(gl, id) {
      this.activeTexture(gl, id);
      this._currenActivetId = -1;
      gl.bindTexture(this.target, null);
    }

    _scope.activeTexture = function(gl, id) {
      this._currenActivetId = id;
      gl.activeTexture({{AGL.Const.TEXTURE0}} + id);
    }

    _scope.bindActiveTexture = function(gl, id) {
      this.activeTexture(gl, id);
      gl.bindTexture(this.target, this._baseTexture);
    }

    _scope.useTexture = function(gl) {
      gl.bindTexture(this.target, this._baseTexture);
      this.uploadTexture(gl);
    }

    _scope.uploadTexture = function(gl) {
      gl.texImage2D(
        this.target,
        0,
        this.internalFormat,
        this.width,
        this.height,
        0,
        this.format,
        this.type,
        this.renderSource
      );

      gl.texParameteri(this.target, {{AGL.Const.TEXTURE_MAX_LEVEL}}, 0);
      gl.generateMipmap(this.target);

      gl.texParameteri(this.target, {{AGL.Const.TEXTURE_WRAP_S}},     this.wrapS);
      gl.texParameteri(this.target, {{AGL.Const.TEXTURE_WRAP_T}},     this.wrapT);
      gl.texParameteri(this.target, {{AGL.Const.TEXTURE_MIN_FILTER}}, this.minMipmapFilter);
      gl.texParameteri(this.target, {{AGL.Const.TEXTURE_MAG_FILTER}}, this.magFilter);
    }
  }
);
