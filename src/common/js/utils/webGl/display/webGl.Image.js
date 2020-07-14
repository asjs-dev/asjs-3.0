require("./webGl.Item.js");
require("./webGl.BlendModes.js");
require("../NameSpace.js");

createClass(WebGl, "Image", WebGl.Item, function(_scope, _super) {
  _scope.textureProps = {
    x         : 0,
    y         : 0,
    rotationZ : 0,
    width     : 1,
    height    : 1,
    anchorX   : 0,
    anchorY   : 0,
    crop      : {
      x      : 0,
      y      : 0,
      width  : 1,
      height : 1
    }
  };

  _scope.textureMatrixCache = m4.identity();
  _scope.texture;

  _scope.tintType  = WebGl.Image.Tint.NORMAL;
  _scope.blendMode = WebGl.BlendModes.NORMAL;

  _scope.textureCropCache = new Float32Array(4);

  _scope.new = function(texture) {
    _scope.texture = texture;
  }

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _scope.textureProps       =
    _scope.textureCrop        =
    _scope.textureMatrixCache =
    _scope.textureCropCache   =
    _scope.tintType           =
    _scope.texture            = null;

    _super.destruct();
  }

  _scope.updateTextureProps = function() {
    var textureProps = _scope.textureProps;

    m4.transformTexture2D(
      textureProps.x,
      textureProps.y,

      textureProps.rotationZ,

      textureProps.anchorX,
      textureProps.anchorY,

      textureProps.width,
      textureProps.height,

      _scope.textureMatrixCache
    );

    _scope.updateTextureCrop();
  }

  _scope.updateTextureCrop = function() {
      var textureCrop = _scope.textureProps.crop;

      _scope.textureCropCache[0] = textureCrop.x;
      _scope.textureCropCache[1] = textureCrop.y;
      _scope.textureCropCache[2] = textureCrop.width;
      _scope.textureCropCache[3] = textureCrop.height;
  }
});
cnst(WebGl.Image, "Tint", {
  "NORMAL"    : 0,
  "GRAYSCALE" : 1,
  "OVERRIDE"  : 2,
});
