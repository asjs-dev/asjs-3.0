require("./agl.BaseDrawable.js");
require("../NameSpace.js");
require("../data/agl.BlendMode.js");
require("../data/props/agl.TextureProps.js");
require("../data/props/agl.TextureCrop.js");

AGL.Image = helpers.createPrototypeClass(
  AGL.BaseDrawable,
  function Image(texture) {
    AGL.BaseDrawable.call(this);

    //this.mask = null;
    //this.interactive = false;

    this.TYPE = AGL.Image.TYPE;

    this.textureMatrixCache = AGL.Matrix3.identity();

    this.maskType = AGL.Image.MaskType.ALPHA;

    this.tintType  = AGL.Image.TintType.NONE;
    this.blendMode = AGL.BlendMode.NORMAL;

    this.textureProps = new AGL.TextureProps();
    this.textureCrop  = new AGL.TextureCrop();

    this._currentTexturePropsUpdateId = 0;

    this.textureCropCache = this.textureCrop.items;

    this.colorCache = this.color.items;

    this.texture = texture;
  },
  function(_scope) {
    _scope.update = function() {
      this._updateProps();
      this._updateTexture();
      this.textureCrop.updateCrop();
    }

    _scope.isContainsPoint = function(point) {
      this._updateAdditionalData();
      return AGL.Matrix3.isPointInMatrix(this._inverseMatrixCache, point);
    }

    _scope._updateTexture = function() {
      var props = this.textureProps;
          props.updateRotation();

      if (this._currentTexturePropsUpdateId < props.updateId) {
        this._currentTexturePropsUpdateId = props.updateId;

        AGL.Matrix3.transformLocal(
          props,
          this.textureMatrixCache
        );
      }
    }
  }
);
AGL.Image.TYPE     = "drawable";
AGL.Image.TintType = helpers.deepFreeze({
  NONE      : 0,
  NORMAL    : 1,
  GRAYSCALE : 2,
  OVERRIDE  : 3
});
AGL.Image.MaskType = helpers.deepFreeze({
  RED   : 0,
  GREEN : 1,
  BLUE  : 2,
  ALPHA : 3,
  AVG   : 4
});
