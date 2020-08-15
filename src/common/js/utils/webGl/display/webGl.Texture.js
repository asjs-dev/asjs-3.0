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
    this.shouldUpdate = false;

    this.texture = gl.createTexture();

    this.maxLevel  = 10;
    this.target    = gl.TEXTURE_2D;
    this.wrapS     = gl.CLAMP_TO_EDGE;
    this.wrapT     = gl.CLAMP_TO_EDGE;
    this.minFilter = gl.NEAREST;
    this.magFilter = gl.NEAREST;

    this.source = source;

    this._sourceWidthPropName = "width";
    this._sourceHeightPropName = "height";
    this._currentRenderId = -1;
  },
  function(_super) {
    get(this, "width",  function() { return this._source[this._sourceWidthPropName]; });
    get(this, "height", function() { return this._source[this._sourceHeightPropName]; });

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

    this.autoUpdate = function(renderId) {
      var shouldUpdate = renderId !== this._currentRenderId;
      this._currentRenderId = renderId;
      return shouldUpdate && (this.shouldUpdate || (this.isVideo && !this.asjsEl.paused));
    }

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
      this._sourceWidthPropName = "naturalWidth";
      this._sourceHeightPropName = "naturalHeight";
      if (!this._source[this._sourceWidthPropName]) {
        this._sourceWidthPropName = "videoWidth";
        this._sourceHeightPropName = "videoHeight";
      }
      if (!this._source[this._sourceWidthPropName]) {
        this._sourceWidthPropName = "width";
        this._sourceHeightPropName = "height";
      }

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
