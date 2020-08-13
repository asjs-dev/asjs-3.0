require("./webGl.Item.js");
require("./webGl.BlendModes.js");
require("../NameSpace.js");
require("../data/props/webGl.TextureProps.js");
require("../data/props/webGl.TextureCrop.js");

WebGl.Image = createPrototypeClass(
  WebGl.Item,
  function(texture) {
    WebGl.Item.call(this);

    cnst(this, "type", WebGl.Image.TYPE);

    var matrixUtils = WebGl.Matrix3;

    this._transformLocal = matrixUtils.transformLocal;

    this.textureMatrixCache = matrixUtils.identity();

    this.mask = null;

    this.tintType  = WebGl.Image.Tint.NORMAL;
    this.blendMode = WebGl.BlendModes.NORMAL;

    this.textureProps = new WebGl.TextureProps();
    this.textureCrop  = new WebGl.TextureCrop();

    this.textureCropCache = this.textureCrop.items;

    this.texture = texture;
  },
  function(_super) {
    this.destruct = function() {
      this.textureProps.destruct();
      this.textureCrop.destruct();

      _super.destruct();
    }

    this.update = function() {
      this._updateProps();
      this._updateTextureProps();
    }

    this._updateProps = function() {
      var props = this.props;
      props.isUpdated() && this._transformItem(props, this.matrixCache);
    }

    this._updateTextureProps = function() {
      var textureProps = this.textureProps;
      textureProps.isUpdated() && this._transformItem(textureProps, this.textureMatrixCache);
    }

    this._transformItem = function(props, cache) {
      this._transformLocal(
        props.x,
        props.y,

        props.sr,
        props.cr,

        props.anchorX,
        props.anchorY,

        props.scaledWidth,
        props.scaledHeight,

        cache
      );
    }
  }
);
cnst(WebGl.Image, "TYPE", "drawable");
cnst(WebGl.Image, "Tint", {
  "NORMAL"    : 0,
  "GRAYSCALE" : 1,
  "OVERRIDE"  : 2,
});
