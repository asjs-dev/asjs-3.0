require("../NameSpace.js");

AGL.Texture = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function Texture(gl, source) {
    helpers.BasePrototypeClass.call(this);

    this._source;
    this._onTextureLoadedBind = this._onTextureLoaded.bind(this);
    this._generateMipmap = false;
    this._loaded = false;

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

    this._sourceWidthProperty  = "width";
    this._sourceHeightProperty = "height";
    this._currentRenderTime    = -1;
    this._eventType;
  },
  function(_super) {
    helpers.get(this, "generateMipmap", function() { return this._generateMipmap; });

    helpers.get(this, "loaded", function() { return this._loaded; });
    helpers.get(this, "width",  function() { return this._source[this._sourceWidthProperty]; });
    helpers.get(this, "height", function() { return this._source[this._sourceHeightProperty]; });

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
AGL.Texture.loadImage = function(gl, src) {
  var image = document.createElement("img");
  var texture = new AGL.Texture(gl, image);
  image.src = src;
  return texture;
};
AGL.Texture.loadVideo = function(gl, src) {
  var video = document.createElement("video");
  var texture = new AGL.Texture(gl, video);
  video.src = src;
  return texture;
};
