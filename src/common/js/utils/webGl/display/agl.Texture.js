require("../NameSpace.js");

AGL.Texture = createPrototypeClass(
  ASJS.BasePrototypeClass,
  function Texture(gl, source) {
    this._source;
    this._onTextureLoadedBind = this._onTextureLoaded.bind(this);
    this._generateMipmap = false;

    this.asjsEl;

    this.loaded = false;
    this.isVideo = false;
    this.shouldUpdate = false;

    this.texture = gl.createTexture();

    this.maxLevel  = 10;
    this.target    = gl.TEXTURE_2D;
    this.wrapS     = gl.CLAMP_TO_EDGE;
    this.wrapT     = gl.CLAMP_TO_EDGE;
    this.minFilter = gl.NEAREST;
    this.magFilter = gl.NEAREST;

    this.source = source;

    this._srcWProp = "width";
    this._srcHProp = "height";
    this._curRenderId = -1;
  },
  function(_super) {
    get(this, "generateMipmap", function() { return this._generateMipmap; });

    get(this, "width",  function() { return this._source[this._srcWProp]; });
    get(this, "height", function() { return this._source[this._srcHProp]; });

    prop(this, "source", {
      get: function() { return this._source; },
      set: function(v) {
        this.asjsEl && this.asjsEl.removeEventListener(
          this.isVideo
            ? ASJS.MediaEvent.CAN_PLAY
            : ASJS.LoaderEvent.LOAD,
          this._onTextureLoadedBind
        );

        this.asjsEl  = v;
        this._source = this.asjsEl.el;

        this.isVideo = this._source.tagName.toLowerCase() === "video";

        this._parseTextureSize();
        this.asjsEl.addEventListener(
          this.isVideo
            ? ASJS.MediaEvent.CAN_PLAY
            : ASJS.LoaderEvent.LOAD,
          this._onTextureLoadedBind
        );
      }
    });

    this.autoUpdate = function(renderId) {
      var shouldUpdate = renderId !== this._curRenderId;
      this._curRenderId = renderId;
      return shouldUpdate && (this.shouldUpdate || (this.isVideo && !this.asjsEl.paused));
    }

    this.destruct = function() {
      this.asjsEl && this.asjsEl.removeEventListener(
        this.isVideo
          ? ASJS.MediaEvent.CAN_PLAY
          : ASJS.LoaderEvent.LOAD,
        this._onTextureLoadedBind
      );

      _super.destruct.call(this);
    }

    this._parseTextureSize = function() {
      this._srcWProp = "naturalWidth";
      this._srcHProp = "naturalHeight";
      if (!this._source[this._srcWProp]) {
        this._srcWProp = "videoWidth";
        this._srcHProp = "videoHeight";
      }
      if (!this._source[this._srcWProp]) {
        this._srcWProp = "width";
        this._srcHProp = "height";
      }

      this._generateMipmap = AGL.Utils.isPowerOf2(this.width) && AGL.Utils.isPowerOf2(this.height);

      this.loaded = this.width > 0 && this.height > 0;
    }

    this._onTextureLoaded = this._parseTextureSize;
  }
);
rof(AGL.Texture, "loadImage", function(gl, src) {
  var img = new ASJS.Image();
      img.src = src;
  return new AGL.Texture(gl, img);
});
rof(AGL.Texture, "loadVideo", function(gl, src) {
  var video = new ASJS.VideoPlayer();
      video.src = src;
  return new AGL.Texture(gl, video);
});
