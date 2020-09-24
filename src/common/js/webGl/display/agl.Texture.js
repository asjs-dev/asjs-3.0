require("../NameSpace.js");

AGL.Texture = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function Texture(source) {
    helpers.BasePrototypeClass.call(this);

    this._source;
    this._onTextureLoadedBind = this._onTextureLoaded.bind(this);

    this._generateMipmap =
    this._loaded         =
    this.isVideo         =
    this.shouldUpdate    = false;

    this.maxLevel  = 10;
    this.target    = AGL.Consts.TEXTURE_2D;
    this.wrapS     =
    this.wrapT     = AGL.Consts.CLAMP_TO_EDGE;
    this.minFilter =
    this.magFilter = AGL.Consts.NEAREST;

    this.source = source;

    this._sourceWidthProperty  = "width";
    this._sourceHeightProperty = "height";
    this._currentRenderTime    = -1;
    this._eventType;
  },
  function(_super) {
    helpers.get(this, "gl",             function() { return this._gl; });
    helpers.get(this, "generateMipmap", function() { return this._generateMipmap; });
    helpers.get(this, "loaded",         function() { return this._loaded; });
    helpers.get(this, "width",          function() { return this._source[this._sourceWidthProperty]; });
    helpers.get(this, "height",         function() { return this._source[this._sourceHeightProperty]; });

    helpers.property(this, "source", {
      get: function() { return this._source; },
      set: function(v) {
        this._source && this._source.removeEventListener(
          this._eventType,
          this._onTextureLoadedBind
        );

        this._source = v;

        this.isVideo = this._getSourceType() === "video";
        this._eventType = this.isVideo
          ? "canplay"
          : "load";

        this._parseTextureSize();

        this._source.addEventListener(
          this._eventType,
          this._onTextureLoadedBind
        );
      }
    });

    this.getTexture = function(context) {
      if (!this._texture || this._gl !== context) {
        this._gl && this._texture && AGL.Utils.deleteTexture(this._gl, this._texture);
        this._gl = context;
        this._texture = this._gl.createTexture();
      }
      return this._texture;
    }

    this.autoUpdate = function(renderTime) {
      var shouldUpdate = this._currentRenderTime < renderTime;
      this._currentRenderTime = renderTime;
      return shouldUpdate && (this.shouldUpdate || (this.isVideo && !this._source.paused));
    }

    this.destruct = function() {
      this._source && this._source.removeEventListener(
        this._eventType,
        this._onTextureLoadedBind
      );

      this._source              =
      this._onTextureLoadedBind = null;

      _super.destruct.call(this);
    }

    this._parseTextureSize = function() {
      this._sourceWidthProperty = "naturalWidth";
      this._sourceHeightProperty = "naturalHeight";
      if (!this._source[this._sourceWidthProperty]) {
        this._sourceWidthProperty = "videoWidth";
        this._sourceHeightProperty = "videoHeight";
      }
      if (!this._source[this._sourceWidthProperty]) {
        this._sourceWidthProperty = "width";
        this._sourceHeightProperty = "height";
      }

      this._generateMipmap = AGL.Utils.isPowerOf2(this.width) && AGL.Utils.isPowerOf2(this.height);

      this._loaded = this._getSourceType() === "canvas" || this.width > 0 && this.height > 0;
    }

    this._getSourceType = function() {
      return this._source.tagName.toLowerCase();
    }

    this._onTextureLoaded = this._parseTextureSize;
  }
);
AGL.Texture.loadImage = function(src) {
  var image = document.createElement("img");
  var texture = new AGL.Texture(image);
  image.src = src;
  return texture;
};
AGL.Texture.loadVideo = function(src) {
  var video = document.createElement("video");
  var texture = new AGL.Texture(video);
  video.src = src;
  return texture;
};
