require("../NameSpace.js");

AGL.SmoothLight = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function SmoothLight(options) {
    options = options || {};

    helpers.BasePrototypeClass.call(this);

    this._framebuffer = new AGL.Framebuffer();

    this.lightRenderer = new AGL.LightRenderer(options);
    this.lightRenderer.clearColor.set(0, 0, 0, 1);
    this.lightRenderer.clearBeforeRender = true;

    this._blurFilter = new AGL.BlurFilter();

    this.filterRenderer = new AGL.FilterRenderer({
      config : {
        context : this.lightRenderer.context,
      },
      texture : this._framebuffer,
      filters : [
        this._blurFilter
      ]
    });
    this.filterRenderer.clearColor.set(0, 0, 0, 0);
    this.filterRenderer.clearBeforeRender = true;

    this.image = new AGL.Image();
    this.image.blendMode = AGL.BlendMode.MULTIPLY;

    if (!options.config.context) {
      this.image.texture = new AGL.Texture(this.filterRenderer.context.canvas, true);
      this._renderFilterFunc = this._renderFilter.bind(this);
    } else {
      this._filterFramebuffer = new AGL.Framebuffer();
      this.image.texture = this._filterFramebuffer;
      this._renderFilterFunc = this._renderFilterToFramebuffer.bind(this);
    }

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

    _scope.render = function() {
      this._resizeFunc();
      this.lightRenderer.renderToFramebuffer(this._framebuffer);
      this._renderFilterFunc();
    }

    _scope._renderFilter = function() {
      this.filterRenderer.render();
    }

    _scope._renderFilterToFramebuffer = function() {
      this.filterRenderer.renderToFramebuffer(this._filterFramebuffer);
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
