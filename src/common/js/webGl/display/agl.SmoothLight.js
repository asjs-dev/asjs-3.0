require("../NameSpace.js");

AGL.SmoothLight = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function SmoothLight(options) {
    options = options || {};

    helpers.BasePrototypeClass.call(this);

    //this._framebuffer = new AGL.Framebuffer(true);

    this.lightRenderer = new AGL.LightRenderer(options);

    this._blurFilter = new AGL.BlurFilter();

    this.filterRenderer = new AGL.FilterRenderer({
      /*config : {
        canvas : this.lightRenderer.canvas,
      },
      texture : this._framebuffer,*/
      texture : new AGL.Texture(this.lightRenderer.canvas, true),
      filters : [
        this._blurFilter
      ]
    });

    this.image = new AGL.Image(new AGL.Texture(this.filterRenderer.canvas, true));
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
          this._resizeFunc = this._resize;
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
      return this.lightRenderer.isContextLost;
    });

    _scope.render = function() {
      this._resizeFunc();
      //this.lightRenderer.renderToTexture(this._framebuffer);
      this.lightRenderer.render();
      this.filterRenderer.render();
    }

    _scope.setSize = function(w, h) {
      this._width  = w;
      this._height = h;

      this._resizeFunc = this._resize;
    }

    _scope.destruct = function() {
      this.lightRenderer.destruct();
      this.filterRenderer.destruct();
      this._blurFilter.destruct();
      this.image.destruct();

      _super.destruct.call(this);
    }

    _scope._resize = function() {
      this._resizeFunc = helpers.emptyFunction;

      var scaledWidth  = this._width  * this._scale;
      var scaledHeight = this._height * this._scale;

      this.image.props.width  = this._width;
      this.image.props.height = this._height;

      this.lightRenderer.setSize(scaledWidth, scaledHeight);
      this.filterRenderer.setSize(scaledWidth, scaledHeight);
    }
  }
);
