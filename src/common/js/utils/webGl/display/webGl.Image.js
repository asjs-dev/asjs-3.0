require("./webGl.Item.js");
require("./webGl.BlendModes.js");
require("../NameSpace.js");
require("../data/props/webGl.TextureProps.js");
require("../data/props/webGl.TextureCrop.js");

WebGl.Image = createPrototypeClass(
  WebGl.Item,
  function Image(texture) {
    WebGl.Item.call(this);

    cnst(this, "type", WebGl.Image.TYPE);

    this.textureMatrixCache = WebGl.Matrix3.identity();

    this.mask = null;

    this.tintType  = WebGl.Image.Tint.NORMAL;
    this.blendMode = WebGl.BlendModes.NORMAL;

    this.textureProps = new WebGl.TextureProps();
    this.textureCrop  = new WebGl.TextureCrop();

    this.textureCropCache = this.textureCrop.items;

    this.texture = texture;
  },
  function() {
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
      WebGl.Matrix3.transformLocal(
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
