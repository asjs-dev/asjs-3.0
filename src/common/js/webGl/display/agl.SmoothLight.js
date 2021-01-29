require("../NameSpace.js");

AGL.SmoothLight = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function SmoothLight(options) {
    options = options || {};

    helpers.BasePrototypeClass.call(this);

    this.renderer = new AGL.LightRenderer(options);

    this._blurFilter = new AGL.BlurFilter(0, 0);
    this._filterRenderer = new AGL.FilterRenderer({
      config : {
        contextAttributes : {
          alpha: true
        }
      },
      texture : new AGL.Texture(this.renderer.canvas, true),
      filters : [
        this._blurFilter
      ]
    });

    this.image = new AGL.Image(new AGL.Texture(this._filterRenderer.canvas, true));
    this.image.blendMode = AGL.BlendMode.MULTIPLY;

    this.scale = options.scale || 1;
    this.blur  = helpers.isEmpty(options.blur) ? 1 : options.blur;
  },
  function(_scope, _super) {
    helpers.property(_scope, "scale", {
      get: function() { return this._scale; },
      set: function(v) {
        if (this._scale !== v) {
          this._scale = v;
          this._resize();
        }
      }
    });

    helpers.property(_scope, "blur", {
      get: function() { return this._blur; },
      set: function(v) {
        if (this._blur !== v) {
          this._blur = v;
          var blurFilter = this._blurFilter;
          blurFilter.intensityX =
          blurFilter.intensityY = this._blur;
        }
      }
    });

    helpers.get(_scope, "isContextLost", function() {
      return this.renderer.isContextLost || this._filterRenderer.isContextLost;
    });

    _scope.render = function() {
      this.renderer.render();
      this._filterRenderer.render();
    }

    _scope.setSize = function(w, h) {
      this._width  = w;
      this._height = h;

      this._resize();
    }

    _scope.destruct = function() {
      this.renderer.destruct();
      this._filterRenderer.destruct();
      this._blurFilter.destruct();
      this.image.destruct();

      _super.destruct.call(this);
    }

    _scope._resize = function() {
      var scaledWidth  = this._width  * this._scale;
      var scaledHeight = this._height * this._scale;
      
      this.renderer.setSize(scaledWidth, scaledHeight);
      this._filterRenderer.setSize(scaledWidth, scaledHeight);
    }
  }
);
