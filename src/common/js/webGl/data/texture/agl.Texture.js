require("../../NameSpace.js");
require("./agl.TextureInfo.js");

AGL.Texture = helpers.createPrototypeClass(
  AGL.TextureInfo,
  function Texture(source, shouldUpdate) {
    AGL.TextureInfo.call(this);

    /*
    this._source = null;
    this._loaded =
    this.isVideo = false;
    */

    this._onTextureLoadedBind = this._onTextureLoaded.bind(this);

    this.source       = source;
    this.shouldUpdate = shouldUpdate;

    this._currentRenderTime = 0;

    this._eventType;
  },
  function(_scope, _super) {
    helpers.get(_scope, "loaded", function() { return this._loaded; });
    helpers.get(_scope, "width",  function() { return this._getSourceWidth() || 1; });
    helpers.get(_scope, "height", function() { return this._getSourceHeight() || 1; });

    helpers.property(_scope, "source", {
      get: function() { return this._source; },
      set: function(v) {
        if (v) {
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

          v.addEventListener(
            this._eventType,
            this._onTextureLoadedBind
          );
        }
      }
    });

    _scope.use = function(gl, id, renderTime, forceBind) {
      if (this._isNeedToDraw(gl, renderTime)) this.useActiveTexture(gl, id);
      else if (this._currenActivetId !== id || forceBind) this.bindActiveTexture(gl, id);
    }

    _scope._isNeedToDraw = function(gl, renderTime) {
      if (this._currentAglId < gl.agl_id) {
        this._currentAglId = gl.agl_id;

        this._baseTexture = gl.createTexture();

        return true;
      }

      if (this.shouldUpdate && this._currentRenderTime < renderTime) {
        this._currentRenderTime = renderTime;
        return true;
      }

      if (this._currentUpdateId < this._updateId) {
        this._currentUpdateId = this._updateId;
        return true;
      }

      if (this.isVideo && !this._source.paused) return true;

      return false;
    }

    _scope.destruct = function() {
      this._source && this._source.removeEventListener(
        this._eventType,
        this._onTextureLoadedBind
      );

      _super.destruct.call(this);
    }

    _scope._getSourceWidth = function() {
      return this._source ? this._source.naturalWidth  || this._source.videoWidth  || this._source.width : 0;
    }

    _scope._getSourceHeight = function() {
      return this._source ? this._source.naturalHeight || this._source.videoHeight || this._source.height : 0;
    }

    _scope._parseTextureSize = function() {
      this._loaded = this._getSourceWidth() > 0 && this._getSourceHeight() > 0;
      if (this._loaded) {
        this.renderSource = this._source;
        ++this._updateId;
      } else this.renderSource = null;
    }

    _scope._getSourceType = function() {
      return this._source.tagName ? this._source.tagName.toLowerCase() : "";
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
