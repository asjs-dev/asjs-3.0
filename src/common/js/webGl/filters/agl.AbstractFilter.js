require("../NameSpace.js");

AGL.AbstractFilter = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function AbstractFilter(type, subType, intensity) {
    helpers.BasePrototypeClass.call(this);

    this.type    = type;
    this.subType = subType;

    this._width  =
    this._height = 0;

    this._values  = new Float32Array(9);
    this._kernels = new Float32Array(9);

    this._gl =
    this._framebufferTexture =
    this._framebuffer = null;

    this.intensity = intensity;
  },
  function(_scope, _super) {
    helpers.get(_scope, "framebufferTexture", function() { return this._framebufferTexture; });
    helpers.get(_scope, "framebuffer",        function() { return this._framebuffer; });
    helpers.get(_scope, "values",             function() { return this._values; });
    helpers.get(_scope, "kernels",            function() { return this._kernels; });

    helpers.property(_scope, "intensity", {
      get: function() { return this._values[0]; },
      set: function(v) { this._values[0] = v; }
    });

    helpers.property(_scope, "intensityX", {
      get: function() { return this._values[0]; },
      set: function(v) { this._values[0] = v; }
    });

    helpers.property(_scope, "intensityY", {
      get: function() { return this._values[1]; },
      set: function(v) { this._values[1] = v; }
    });

    helpers.property(_scope, "r", {
      get: function() { return this._values[2]; },
      set: function(v) { this._values[2] = v; }
    });

    helpers.property(_scope, "g", {
      get: function() { return this._values[3]; },
      set: function(v) { this._values[3] = v; }
    });

    helpers.property(_scope, "b", {
      get: function() { return this._values[4]; },
      set: function(v) { this._values[4] = v; }
    });

    _scope.destruct = function() {
      this._framebufferTexture && this._gl.deleteTexture(this._framebufferTexture);
      this._framebuffer && this._gl.deleteFramebuffer(this._framebuffer);

      this._values             =
      this._kernels            =
      this._gl                 =
      this._framebufferTexture =
      this._framebuffer        = null;

      _super.destruct.call(this);
    }

    _scope.updateFramebuffer = function(gl, width, height) {
      if (width > 0 && height > 0 && (!this._framebuffer || this._gl !== gl || this._width !== width || this._height !== height)) {
        this._framebufferTexture && this._gl.deleteTexture(this._framebufferTexture);
        this._framebuffer && this._gl.deleteFramebuffer(this._framebuffer);

        this._width  = width;
        this._height = height;
        this._gl = gl;

        this._framebufferTexture = gl.createTexture();
        this.bindTexture(gl, 0);

        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          this._width,
          this._height,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          null
        );

        this._framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          this._framebufferTexture,
          0
        );
      }
    }

    _scope.bindTexture = function(gl, index) {
      gl.activeTexture(gl.TEXTURE0 + index);
      gl.bindTexture(gl.TEXTURE_2D, this._framebufferTexture);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
  }
);
