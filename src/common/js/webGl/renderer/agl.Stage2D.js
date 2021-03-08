require("../NameSpace.js");
require("./agl.BatchRendererBase.js");
require("../display/agl.Item.js");
require("../geom/agl.Matrix3.js");

AGL.Stage2D = helpers.createPrototypeClass(
  AGL.BatchRendererBase,
  function Stage2D(options) {
    options = options || {};

    options.config = AGL.Utils.initConfig(options.config, AGL.Stage2D);

    var locations = [
      "aWrlCol",
      "aTintCol",
      "aAlpCol",
      "aFx",
      "aMsk"
    ];

    options.config.locations = options.config.locations.concat(locations);

    AGL.BatchRendererBase.call(this, options);
    /*
    this.picked;
    this._isPickerSet = false;
    */

    this.pickerPoint = AGL.Point.create();
  },
  function(_scope, _super) {
    _scope.render = function() {
      this.picked = null;

      _super.render.call(this);

      this._isPickerSet = false;
    }

    _scope.setPickerPoint = function(point) {
      this._isPickerSet = true;

      this.pickerPoint.x = (point.x - this.widthHalf)  * this.matrixCache[0];
      this.pickerPoint.y = (point.y - this.heightHalf) * this.matrixCache[4];
    }

    _scope._setMaskData = function(item) {
      var id = this._batchItems * 2;
      if (item.mask) {
        this._maskData[id]     = this._drawTexture(item.mask, true);
        this._maskData[id + 1] = item.maskType;
      } else this._maskData[id] = -1;
    }

    _scope._setBufferData = function(item, textureMapIndex) {
      _super._setBufferData.call(this, item, textureMapIndex);

      var quadId = this._batchItems * 4;
      var duoId  = this._batchItems * 2;

      helpers.arraySet(this._parentColorData, item.parent.colorCache, quadId);
      helpers.arraySet(this._tintColorData,   item.colorCache,        quadId);

      this._alphaData[duoId]     = item.props.alpha;
      this._alphaData[duoId + 1] = item.parent.props.alpha;

      this._effectData[duoId]     = textureMapIndex;
      this._effectData[duoId + 1] = item.tintType;
    }

    _scope._drawImage = function(item) {
      this._setBlendMode(item.blendMode);

      if (
        this._isPickerSet &&
        item.interactive &&
        item.isContainsPoint(this.pickerPoint)
      ) this.picked = item;

      this._setMaskData(item);

      var textureMapIndex = this._drawTexture(item.texture, false);

      this._setBufferData(item, textureMapIndex);

      ++this._batchItems === this._maxBatchItems && this._batchDraw();
    }

    _scope._bindBuffers = function() {
      _super._bindBuffers.call(this);
  		this._bindArrayBuffer(this._parentColorBuffer, this._parentColorData);
      this._bindArrayBuffer(this._tintColorBuffer,   this._tintColorData);
      this._bindArrayBuffer(this._alphaBuffer,       this._alphaData);
      this._bindArrayBuffer(this._effectBuffer,      this._effectData);
      this._bindArrayBuffer(this._maskBuffer,        this._maskData);
    }

    _scope._initCustom = function() {
      _super._initCustom.call(this);

      var maxBatchItems = this._maxBatchItems;

      this._parentColorData   = new F32A(maxBatchItems * 4);
      this._parentColorBuffer = this._createArrayBuffer(this._parentColorData, "aWrlCol",  4, 1, 4, {{AGL.Const.FLOAT}}, 4);
      this._tintColorData     = new F32A(maxBatchItems * 4);
      this._tintColorBuffer   = this._createArrayBuffer(this._tintColorData,   "aTintCol", 4, 1, 4, {{AGL.Const.FLOAT}}, 4);
      this._alphaData         = new F32A(maxBatchItems * 2);
      this._alphaBuffer       = this._createArrayBuffer(this._alphaData,       "aAlpCol",  2, 1, 2, {{AGL.Const.FLOAT}}, 4);
      this._effectData        = new F32A(maxBatchItems * 2);
      this._effectBuffer      = this._createArrayBuffer(this._effectData,      "aFx",      2, 1, 2, {{AGL.Const.FLOAT}}, 4);
      this._maskData          = new F32A(maxBatchItems * 2);
      this._maskBuffer        = this._createArrayBuffer(this._maskData,        "aMsk",     2, 1, 2, {{AGL.Const.FLOAT}}, 4);
    }
  }
);
AGL.Stage2D.createVertexShader = function(config) {
  return AGL.Utils.createVersion(config.precision) +

  "in vec2 aPos;" +
  "in mat4 aMt;" +
  "in vec4 aWrlCol;" +
  "in vec4 aTintCol;" +
  "in vec2 aAlpCol;" +

  "in vec2 aMsk;" +

  "in vec2 aFx;" +

  "uniform float uFlpY;" +

  "out vec2 vTCrd;" +

  "out float vMskTexId;" +
  "flat out int vMskTp;" +
  "out vec2 vMskCrd;" +

  "out vec4 vTexCrop;" +
  "out vec4 vWrlCol;" +
  "out vec4 vTintCol;" +
  "out float vAlpCol;" +
  "out float vTexId;" +
  "out float vTintTp;" +
  "out vec2 vGlPos;" +

  "void main(void){" +
    AGL.Utils.calcGlPositions +
    "vGlPos=gl_Position.xy;" +
    "vWrlCol=aWrlCol;" +
    "vTintCol=vec4(aTintCol.rgb*aTintCol.a,1.-aTintCol.a);" +
    "vAlpCol=aAlpCol.x*aAlpCol.y;" +

    "vTexId=aFx.x;" +
    "vTintTp=aFx.y;" +

    "vMskTexId=aMsk.x;" +
    "vMskTp=int(aMsk.y);" +
    "vMskCrd=(vGlPos+vec2(1,-1))/vec2(2,-2);" +

  "}";
};
AGL.Stage2D.createFragmentShader = function(config) {
  var maxTextureImageUnits = AGL.Utils.info.maxTextureImageUnits;

  return AGL.Utils.createVersion(config.precision) +

  "in float vMskTexId;" +
  "flat in int vMskTp;" +
  "in vec2 vMskCrd;" +

  "in vec2 vTCrd;" +
  "in vec4 vTexCrop;" +
  "in vec4 vWrlCol;" +
  "in vec4 vTintCol;" +
  "in float vAlpCol;" +
  "in float vTexId;" +
  "in float vTintTp;" +
  "in vec2 vGlPos;" +

  "uniform sampler2D uTex[" + maxTextureImageUnits + "];" +

  "out vec4 fgCol;" +

  AGL.Utils.createGetTextureFunction(maxTextureImageUnits) +

  "void main(void){" +
    AGL.Utils.getTexColor +
    "if(vAlpCol==0.||fgCol.a==0.)discard;" +

    "float mskA=1.;" +
    "if(vMskTexId>-1.){" +
      "vec4 mskCol=gtTexCol(vMskTexId,vMskCrd);" +
      "mskA=vMskTp<4" +
        "?mskCol[vMskTp]" +
        ":(mskCol.r+mskCol.g+mskCol.b+mskCol.a)/4.;" +
    "}" +

    "fgCol.a*=vAlpCol*mskA;" +

    "if(fgCol.a==0.)discard;" +

    "if(vTintTp>0.){" +
      "vec3 col=vTintCol.rgb+fgCol.rgb*vTintCol.a;" +
      "if(vTintTp<2.||(vTintTp<3.&&fgCol.r==fgCol.g&&fgCol.r==fgCol.b))" +
        "fgCol.rgb*=col;" +
      "else if(vTintTp<4.)" +
        "fgCol.rgb=col;" +
    "}" +
    "fgCol*=vWrlCol;" +
  "}";
};
