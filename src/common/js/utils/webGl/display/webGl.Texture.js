require("../NameSpace.js");

WebGl.Texture = createPrototypeClass(
  ASJS.BasePrototypeClass,
  function Texture(gl, source) {
    this._wglUtils = WebGl.Utils.instance;
    this._source;
    this._onTextureLoadedBind = this._onTextureLoaded.bind(this);

    this.asjsEl;

    this.loaded = false;
    this.isVideo = false;

    this.width  = 1;
    this.height = 1;

    this.texture = gl.createTexture();

    this.maxLevel  = 10;
    this.target    = gl.TEXTURE_2D;
    this.wrapS     = gl.CLAMP_TO_EDGE;
    this.wrapT     = gl.CLAMP_TO_EDGE;
    this.minFilter = gl.NEAREST;
    this.magFilter = gl.NEAREST;

    this.source = source;
  },
  function(_super) {
    get(this, "autoUpdate", function() { return this.isVideo && !this.asjsEl.paused; });

    prop(this, "source", {
      get: function() { return this._source; },
      set: function(v) {
        this.asjsEl && this.asjsEl.removeEventListener(
          this.isVideo
            ? ASJS.MediaEvent.CAN_PLAY
            : ASJS.LoaderEvent.LOAD,
          this._onTextureLoadedBind
        );

        this.asjsEl = v;
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

    this.destruct = function() {
      this.asjsEl.removeEventListener(ASJS.LoaderEvent.LOAD, this._onTextureLoadedBind);
      this.asjsEl.removeEventListener(
        this.isVideo
          ? ASJS.MediaEvent.CAN_PLAY
          : ASJS.LoaderEvent.LOAD,
        this._onTextureLoadedBind
      );

      _super.destruct.call(this);
    }

    this._parseTextureSize = function() {
      this.width  = this._source.naturalWidth  || this._source.videoWidth  || this._source.width;
      this.height = this._source.naturalHeight || this._source.videoHeight || this._source.height;
      this.loaded = this.width > 0 && this.height > 0;
    }

    this._onTextureLoaded = this._parseTextureSize;
  }
);
rof(WebGl.Texture, "loadImage", function(gl, src) {
  var img = new ASJS.Image();
      img.src = src;
  return new WebGl.Texture(gl, img);
});
rof(WebGl.Texture, "loadVideo", function(gl, src) {
  var video = new ASJS.VideoPlayer();
      video.src = src;
  return new WebGl.Texture(gl, video);
});
