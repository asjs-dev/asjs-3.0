require("./agl.Item.js");
require("../NameSpace.js");
require("../data/agl.BlendMode.js");
require("../data/props/agl.TextureProps.js");
require("../data/props/agl.TextureCrop.js");

AGL.Image = helpers.createPrototypeClass(
  AGL.Item,
  function Image(texture) {
    AGL.Item.call(this);

    helpers.constant(this, "type", AGL.Image.TYPE);

    this.textureMatrixCache = AGL.Matrix3.identity();

    this.mask = null;

    this.tintType  = AGL.Image.TintType.NONE;
    this.blendMode = AGL.BlendMode.NORMAL;

    this.textureProps = new AGL.TextureProps();
    this.textureCrop  = new AGL.TextureCrop();

    this._currentTexturePropsUpdateId = 0;

    this.textureCropCache = this.textureCrop.items;

    this.texture = texture;
  },
  function(_scope, _super) {
    _scope.update = function() {
      var props = this.props;
      if (this._currentPropsUpdateId < props.updateId) {
        this._currentPropsUpdateId = props.updateId;
        this._transformItem(props, this.matrixCache);
      }

      var textureProps = this.textureProps;
      if (this._currentTexturePropsUpdateId < textureProps.updateId) {
        this._currentTexturePropsUpdateId = textureProps.updateId;
        this._transformItem(textureProps, this.textureMatrixCache);
      }
    }

    _scope._transformItem = function(props, cache) {
      AGL.Matrix3.transformLocal(
        props.x,
        props.y,

        props.sinRotation,
        props.cosRotation,

        props.anchorX,
        props.anchorY,

        props.scaledWidth,
        props.scaledHeight,

        cache
      );
    }
  }
);
helpers.constant(AGL.Image, "TYPE", "drawable");
helpers.constant(AGL.Image, "TintType", {
  "NONE"      : 0,
  "NORMAL"    : 1,
  "GRAYSCALE" : 2,
  "OVERRIDE"  : 3,
});
