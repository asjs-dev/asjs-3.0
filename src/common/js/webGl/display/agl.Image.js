require("./agl.AbstractDrawable.js");
require("../NameSpace.js");
require("../data/agl.BlendMode.js");
require("../data/props/agl.TextureProps.js");
require("../data/props/agl.TextureCrop.js");

AGL.Image = helpers.createPrototypeClass(
  AGL.AbstractDrawable,
  function Image(texture) {
    AGL.AbstractDrawable.call(this);

    this.TYPE = AGL.Image.TYPE;

    this.textureMatrixCache = AGL.Matrix3.identity();

    this.mask = null;

    this.interactive = false;

    this.tintType  = AGL.Image.TintType.NONE;
    this.blendMode = AGL.BlendMode.NORMAL;

    this.textureProps = new AGL.TextureProps();
    this.textureCrop  = new AGL.TextureCrop();

    this._currentTexturePropsUpdateId = 0;

    this.textureCropCache = this.textureCrop.items;

    this.texture = texture;
  },
  function(_scope) {
    _scope.update = function(renderTime) {
      this._updateProps();
      this._updateTexture();
    }

    _scope.isContainsPoint = function(point) {
      this._updateAdditionalData();
      return AGL.Matrix3.isPointInMatrix(this._inverseMatrixCache, point);
    }

    _scope._updateTexture = function() {
      var props = this.textureProps;

      if (this._currentTexturePropsUpdateId < props.updateId) {
        this._currentTexturePropsUpdateId = props.updateId;

        props.updateRotations();

        AGL.Matrix3.transformLocal(
          props,
          this.textureMatrixCache
        );
      }
    }
  }
);
AGL.Image.TYPE     = "drawable";
AGL.Image.TintType = {
  NONE      : 0,
  NORMAL    : 1,
  GRAYSCALE : 2,
  OVERRIDE  : 3,
};
