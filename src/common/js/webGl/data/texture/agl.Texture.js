require("../../NameSpace.js");
require("./agl.TextureInfo.js");

AGL.Texture = helpers.createPrototypeClass(
  AGL.TextureInfo,
  function Texture(source, shouldUpdate) {
    AGL.TextureInfo.call(this, shouldUpdate);

    this._onTextureLoadedBind = this._onTextureLoaded.bind(this);

    this._source = null;

    this.isVideo = false;

    this.source = source;

    this._sourceWidthProperty  = "width";
    this._sourceHeightProperty = "height";
    this._eventType;
  },
  function(_scope, _super) {
    helpers.get(_scope, "width",  function() { return this._source[this._sourceWidthProperty]; });
    helpers.get(_scope, "height", function() { return this._source[this._sourceHeightProperty]; });

    helpers.property(_scope, "minFilter", {
      get: function() { return this._minFilter; },
      set: function(v) {
        if (this._minFilter !== v) {
          this._minFilter = v;
          this._updateMipmapMinFilter();
        }
      }
    });

    helpers.property(_scope, "source", {
      get: function() { return this._source; },
      set: function(v) {
        this._loaded = false;

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

    _scope.isNeedToDraw = function(gl, renderTime) {
      return _super.isNeedToDraw.call(this, gl, renderTime) || (this.isVideo && !this._source.paused);
    }

    _scope.destruct = function() {
      this._source && this._source.removeEventListener(
        this._eventType,
        this._onTextureLoadedBind
      );

      _super.destruct.call(this);
    }

    _scope._parseTextureSize = function() {
      this._sourceWidthProperty  = "naturalWidth";
      this._sourceHeightProperty = "naturalHeight";

      if (!this._source[this._sourceWidthProperty]) {
        this._sourceWidthProperty  = "videoWidth";
        this._sourceHeightProperty = "videoHeight";
      }

      if (!this._source[this._sourceWidthProperty]) {
        this._sourceWidthProperty  = "width";
        this._sourceHeightProperty = "height";
      }

      this.generateMipmap = AGL.Utils.isPowerOf2(this.width) && AGL.Utils.isPowerOf2(this.height);
      this._updateMipmapMinFilter();

      this._loaded = this._getSourceType() === "canvas" || (this.width > 0 && this.height > 0);
      this._loaded && (this._updateId = AGL.CurrentTime);
    }

    _scope._getSourceType = function() {
      return this._source.tagName ? this._source.tagName.toLowerCase() : "canvas";
    }

    _scope._updateMipmapMinFilter = function() {
      this._mipmapMinFilter = this.generateMipmap
        ? (this._minFilter === AGL.Const.LINEAR
          ? AGL.Const.LINEAR_MIPMAP_LINEAR
          : AGL.Const.NEAREST_MIPMAP_NEAREST)
        : this._minFilter;
    }

    _scope._onTextureLoaded = _scope._parseTextureSize;
  }
);
AGL.Texture.loadImage = function(src, shouldUpdate) {
  var image = document.createElement("img");
  var texture = new AGL.Texture(image, shouldUpdate);
  image.src = src;
  return texture;
};
AGL.Texture.loadVideo = function(src, shouldUpdate) {
  var video = document.createElement("video");
  var texture = new AGL.Texture(video, shouldUpdate);
  video.src = src;
  return texture;
};
