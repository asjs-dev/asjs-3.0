require("./agl.Item.js");
require("../NameSpace.js");
require("../data/agl.BlendModes.js");
require("../data/props/agl.TextureProps.js");
require("../data/props/agl.TextureCrop.js");

AGL.Image = createPrototypeClass(
  AGL.Item,
  function Image(texture) {
    AGL.Item.call(this);

    cnst(this, "type", AGL.Image.TYPE);

    this.textureMatrixCache = AGL.Matrix3.identity();

    this.mask = null;

    this.tintType  = AGL.Image.Tint.NORMAL;
    this.blendMode = AGL.BlendModes.NORMAL;

    this.textureProps = new AGL.TextureProps();
    this.textureCrop  = new AGL.TextureCrop();

    this.textureCropCache = this.textureCrop.items;

    this.texture = texture;
  },
  function() {
    this.mouseOver = function() {}

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
      AGL.Matrix3.transformLocal(
        props.x,
        props.y,

        props.sinR,
        props.cosR,

        props.anchorX,
        props.anchorY,

        props.scaledWidth,
        props.scaledHeight,

        cache
      );
    }
  }
);
cnst(AGL.Image, "TYPE", "drawable");
cnst(AGL.Image, "Tint", {
  "NORMAL"    : 0,
  "GRAYSCALE" : 1,
  "OVERRIDE"  : 2,
});
