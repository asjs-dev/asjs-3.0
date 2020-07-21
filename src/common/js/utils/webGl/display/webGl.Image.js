require("./webGl.Item.js");
require("./webGl.BlendModes.js");
require("../NameSpace.js");
require("../data/props/webGl.TextureProps.js");
require("../data/props/webGl.TextureCrop.js");

createClass(WebGl, "Image", WebGl.Item, function(_scope, _super) {
  var _prt = _super.protected;

  var _matrixUtils = WebGl.Matrix3;

  _scope.textureMatrixCache = _matrixUtils.identity();
  _scope.texture;

  _scope.mask;

  _scope.tintType  = WebGl.Image.Tint.NORMAL;
  _scope.blendMode = WebGl.BlendModes.NORMAL;

  _scope.textureCropCache = new Float32Array(4);

  override(_scope, _super, "new");
  _scope.new = function(texture) {
    _super.new();

    _scope.texture = texture;

    _scope.textureProps = new WebGl.TextureProps(_scope.updateTextureProps);
    _scope.textureCrop = new WebGl.TextureCrop(_scope.updateTextureCrop);
  }

  override(_scope, _super, "destruct");
  _scope.destruct = function() {
    _scope.textureProps.destruct();
    _scope.textureCrop.destruct();
    
    _scope.textureProps       =
    _scope.textureCrop        =
    _scope.textureMatrixCache =
    _scope.textureCropCache   =
    _scope.tintType           =
    _scope.texture            = null;

    _super.destruct();
  }

  _scope.updateTextureProps = function() {
    _prt.updateList.push(_prt.updateTextureProps);
  }

  _scope.updateTextureCrop = function() {
    _prt.updateList.push(_prt.updateTextureCrop);
  }

  _prt.updateTextureProps = function() {
    var textureProps = _scope.textureProps;

    _matrixUtils.transformTexture(
      textureProps.x,
      textureProps.y,

      textureProps.rotation,

      textureProps.anchorX,
      textureProps.anchorY,

      textureProps.width,
      textureProps.height,

      _scope.textureMatrixCache
    );
  }

  _prt.updateTextureCrop = function() {
    var textureCrop = _scope.textureCrop;

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
