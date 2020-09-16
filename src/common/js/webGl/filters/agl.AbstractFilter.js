require("../NameSpace.js");

AGL.AbstractFilter = createPrototypeClass(
  BasePrototypeClass,
  function AbstractFilter() {
    BasePrototypeClass.call(this);

    this.type =
    this.subType = 0;

    this._vals = new Float32Array(9);

    this._w =
    this._h = 0;

    this._gl =
    this._tex =
    this._frmBuf = null;
  },
  function() {
    get(this, "framebufferTexture", function() { return this._tex; });
    get(this, "framebuffer",        function() { return this._frmBuf; });
    get(this, "values",             function() { return this._vals; });

    prop(this, "intensity", {
      get: function() { return this._vals[0]; },
      set: function(v) { this._vals[0] = v; },
    });

    this.updateFramebuffer = function(gl, width, height) {
      if (width > 0 && height > 0 && (!this._frmBuf || this._gl !== gl || this._w !== width || this._h !== height)) {
        this._tex && this._gl.deleteTexture(this._tex);
        this._frmBuf && this._gl.deleteFramebuffer(this._frmBuf);

        this._w = width;
        this._h = height;
        this._gl = gl;

        this._tex = gl.createTexture();
        this.bindTexture(gl, 0);

        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          this._w,
          this._h,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          null
        );

        this._frmBuf = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._frmBuf);
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          this._tex,
          0
        );
      }
    }

    this.bindTexture = function(gl, index) {
      gl.activeTexture(gl.TEXTURE0 + index);
      gl.bindTexture(gl.TEXTURE_2D, this._tex);
      
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
  }
);
cnst(AGL.AbstractFilter, "CONVOLUTE_TYPE", 1);
cnst(AGL.AbstractFilter, "COLOR_MANIPULATION_TYPE", 2);
