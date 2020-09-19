require("../NameSpace.js");

AGL.AbstractFilter = createPrototypeClass(
  BasePrototypeClass,
  function AbstractFilter() {
    BasePrototypeClass.call(this);

    this.type    =
    this.subType = 0;

    this._values = new Float32Array(9);

    this._width =
    this._height = 0;

    this._gl =
    this._framebufferTexture =
    this._framebuffer = null;
  },
  function() {
    get(this, "framebufferTexture", function() { return this._framebufferTexture; });
    get(this, "framebuffer",        function() { return this._framebuffer; });
    get(this, "values",             function() { return this._values; });

    prop(this, "intensity", {
      get: function() { return this._values[0]; },
      set: function(v) { this._values[0] = v; },
    });

    this.updateFramebuffer = function(gl, width, height) {
      if (width > 0 && height > 0 && (!this._framebuffer || this._gl !== gl || this._width !== width || this._height !== height)) {
        this._framebufferTexture && this._gl.deleteTexture(this._framebufferTexture);
        this._framebuffer && this._gl.deleteFramebuffer(this._framebuffer);

        this._width = width;
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

    this.bindTexture = function(gl, index) {
      gl.activeTexture(gl.TEXTURE0 + index);
      gl.bindTexture(gl.TEXTURE_2D, this._framebufferTexture);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
  }
);
cnst(AGL.AbstractFilter, "CONVOLUTE_TYPE", 1);
cnst(AGL.AbstractFilter, "COLOR_MANIPULATION_TYPE", 2);
