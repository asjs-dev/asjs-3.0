require("../NameSpace.js");
require("./agl.BaseBatchRenderer.js");
require("../display/agl.Item.js");
require("../geom/agl.Matrix3.js");

AGL.Stage2D = helpers.createPrototypeClass(
  AGL.BaseBatchRenderer,
  function Stage2D(options) {
    options                  = options || {};
    options.config           = AGL.Utils.initRendererConfig(options.config, AGL.Stage2D);
    options.config.locations = options.config.locations.concat([
      "aWrlCol",
      "aTintCol",
      "aAlpCol",
      "aFx",
      "aMsk"
    ]);

    AGL.BaseBatchRenderer.call(this, options);
    /*
    this.picked;
    this._isPickerSet = false;
    */

    this.pickerPoint = AGL.Point.create();

    var maxBatchItems = this._MAX_BATCH_ITEMS;

    this._parentColorBuffer = new AGL.Buffer(
      new F32A(maxBatchItems * 4),
      "aWrlCol", 4, 1, 4
    );

    this._tintColorBuffer = new AGL.Buffer(
      new F32A(maxBatchItems * 4),
      "aTintCol", 4, 1, 4
    );

    this._alphaBuffer = new AGL.Buffer(
      new F32A(maxBatchItems * 2),
      "aAlpCol", 2, 1, 2
    );

    this._effectBuffer = new AGL.Buffer(
      new F32A(maxBatchItems * 2),
      "aFx", 2, 1, 2
    );

    this._maskBuffer = new AGL.Buffer(
      new F32A(maxBatchItems * 2),
      "aMsk", 2, 1, 2
    );
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

    _scope._drawImageCustomSettings = function(item) {
      if (
        this._isPickerSet &&
        item.interactive &&
        item.isContainsPoint(this.pickerPoint)
      ) this.picked = item;

      var maskId = this._batchItems * 2;
      if (item.mask) {
        this._maskBuffer.data[maskId] = this._context.useTexture(
          item.mask,
          this._renderTime,
          false,
          1,
          this._batchDrawBound
        );
        this._maskBuffer.data[maskId + 1] = item.maskType;
      } else this._maskBuffer.data[maskId] = -1;

      var quadId = this._batchItems * 4;
      var duoId  = this._batchItems * 2;

      helpers.arraySet(this._parentColorBuffer.data, item.parent.colorCache, quadId);
      helpers.arraySet(this._tintColorBuffer.data,   item.colorCache,        quadId);

      this._alphaBuffer.data[duoId]     = item.props.alpha;
      this._alphaBuffer.data[duoId + 1] = item.parent.props.alpha;

      this._effectBuffer.data[duoId] = this._context.useTexture(
        item.texture,
        this._renderTime,
        false,
        0,
        this._batchDrawBound
      );
      this._effectBuffer.data[duoId + 1] = item.tintType;
    }

    _scope._uploadBuffers = function() {
      var gl            = this._gl;
      var locations     = this._locations;
      var enableBuffers = this._enableBuffers;

      this._parentColorBuffer.upload(gl, enableBuffers, locations);
      this._tintColorBuffer.upload(gl,   enableBuffers, locations);
      this._alphaBuffer.upload(gl,       enableBuffers, locations);
      this._effectBuffer.upload(gl,      enableBuffers, locations);
      this._maskBuffer.upload(gl,        enableBuffers, locations);

      _super._uploadBuffers.call(this);
    }

    _scope._createBuffers = function() {
      _super._createBuffers.call(this);

      var gl = this._gl;

      this._parentColorBuffer.create(gl);
      this._tintColorBuffer.create(gl);
      this._alphaBuffer.create(gl);
      this._effectBuffer.create(gl);
      this._maskBuffer.create(gl);
    }

    _scope._createVertexShader = function(config) {
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
        "vMskCrd=(vGlPos+vec2(1,-uFlpY))/vec2(2,-2.*uFlpY);" +

      "}";
    };

    _scope._createFragmentShader = function(config) {
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
  }
);
