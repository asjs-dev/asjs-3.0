require("../NameSpace.js");
require("./agl.BaseRenderer.js");
require("../display/agl.Item.js");
require("../geom/agl.Matrix3.js");

AGL.Stage2D = helpers.createPrototypeClass(
  AGL.BaseRenderer,
  function Stage2DRenderer(config) {
    config.vertexShader   = config.vertexShader   || AGL.Stage2D.createVertexShader;
    config.fragmentShader = config.fragmentShader || AGL.Stage2D.createFragmentShader;

    var locations = [
      "aWrlCol",
      "aTintCol",
      "aAlpCol",
      "aFx",
      "uLg",
      "uFog"
    ];
    config.isMaskEnabled && locations.push("aMsk");

    config.locations = config.locations.concat(locations);

    AGL.BaseRenderer.call(this, config);

    this.fog = new AGL.ColorProps();
    this.fog.a = 0;

    this.colorCache = this.color.items;

    this._zCounter    =
    this._fogUpdateId = 0;

    this._lights = [];

    this.picked;
    this._isPickerSet = false;

    this.pickerPoint = AGL.Point.create();

    this._collectLightsFunc = helpers.emptyFunction;
    if (config.isLightEnabled) {
      this._lightData = new Float32Array(config.lightNum * 16);

      var l = config.lightNum;
      for (var i = 0; i < l; ++i)
        this._lights.push(new AGL.Light(
          i,
          this._lightData
        ));

      this._collectLightsFunc = this._collectLights.bind(this);
    }

    this._setMaskDataFunc = config.isMaskEnabled
      ? this._setMaskData.bind(this)
      : helpers.emptyFunction;

    this._resize();
  },
  function(_scope, _super) {
    _scope.render = function() {
      this._preRender();

      this.picked = null;
      this._zCounter = 0;

      this.colorUpdateId = this.color.updateId;

      this._updateFog();
      this._collectLightsFunc();

      this._render();

      this._isPickerSet = false;
    }

    _scope.getLight = function(id) {
      return this._lights[id];
    }

    _scope.setPickerPoint = function(point) {
      this._isPickerSet = true;

      this.pickerPoint.x = (point.x - this.widthHalf)  * this.matrixCache[0];
      this.pickerPoint.y = (point.y - this.heightHalf) * this.matrixCache[4];
    }

    _scope._updateFog = function() {
      var fogProps = this.fog;
      if (this._fogUpdateId < fogProps.updateId) {
        this._fogUpdateId = fogProps.updateId;
        this._gl.uniform4fv(this._locations.uFog, fogProps.items);
      }
    }

    _scope._collectLights = function() {
      this._gl.uniformMatrix4fv(this._locations.uLg, false, this._lightData);
    }

    _scope._drawItem = function(item) {
      item.props.z = ++this._zCounter;
      item.update(this._renderTime);
      this._drawFunctionMap[item.TYPE](item);
    }

    _scope._setMaskData = function(item, duoId) {
      this._maskData[duoId]     = this._drawTexture(item.mask, true);
      this._maskData[duoId + 1] = item.maskType;
    }

    _scope._setBufferData = function(item, textureMapIndex, matId, quadId, effectId, douId) {
      _super._setBufferData.call(this, item, textureMapIndex, matId, quadId);

      helpers.arraySet(this._parentColorData, item.parent.colorCache, quadId);
      helpers.arraySet(this._tintColorData,   item.colorCache,        quadId);

      this._alphaData[douId]     = item.props.alpha;
      this._alphaData[douId + 1] = item.parent.props.alpha;

      this._effectData[effectId]     = textureMapIndex;
      this._effectData[effectId + 1] = item.tintType;
      this._effectData[effectId + 2] = item.props.z;
    }

    _scope._drawImage = function(item) {
      this._setBlendMode(item.blendMode);

      if (
        this._isPickerSet &&
        item.interactive &&
        item.isContainsPoint(this.pickerPoint)
      ) this.picked = item;

      var duoId = this._batchItems * 2;
      this._setMaskDataFunc(item, duoId);

      var textureMapIndex = this._drawTexture(item.texture, false);

      this._setBufferData(
        item,
        textureMapIndex,
        this._batchItems * 16,
        this._batchItems * 4,
        this._batchItems * 3,
        duoId
      );

      ++this._batchItems === this._MAX_BATCH_ITEMS && this._batchDraw();
    }

    _scope._bindBuffers = function() {
      _super._bindBuffers.call(this);
  		this._bindArrayBuffer(this._parentColorBuffer, this._parentColorData);
      this._bindArrayBuffer(this._tintColorBuffer,   this._tintColorData);
      this._bindArrayBuffer(this._alphaBuffer,       this._alphaData);
      this._bindArrayBuffer(this._effectBuffer,      this._effectData);
      this._bindMaskBufferFunc();
    }

    _scope._initCustom = function() {
      _super._initCustom.call(this);

      this._parentColorData   = new Float32Array(this._MAX_BATCH_ITEMS * 4);
      this._parentColorBuffer = this._createArrayBuffer(this._parentColorData, "aWrlCol",  4, 1, 4, AGL.Const.FLOAT, 4);
      this._tintColorData     = new Float32Array(this._MAX_BATCH_ITEMS * 4);
      this._tintColorBuffer   = this._createArrayBuffer(this._tintColorData,   "aTintCol", 4, 1, 4, AGL.Const.FLOAT, 4);
      this._alphaData         = new Float32Array(this._MAX_BATCH_ITEMS * 2);
      this._alphaBuffer       = this._createArrayBuffer(this._alphaData,       "aAlpCol",  2, 1, 2, AGL.Const.FLOAT, 4);
      this._effectData        = new Float32Array(this._MAX_BATCH_ITEMS * 3);
      this._effectBuffer      = this._createArrayBuffer(this._effectData,      "aFx",      3, 1, 3, AGL.Const.FLOAT, 4);

      if (this._config.isMaskEnabled) {
        this._maskData        = new Float32Array(this._MAX_BATCH_ITEMS * 2);
        this._maskBuffer      = this._createArrayBuffer(this._maskData,        "aMsk",     2, 1, 2, AGL.Const.FLOAT, 4);
      }

      this._bindMaskBufferFunc = this._config.isMaskEnabled
        ? this._bindArrayBuffer.bind(this, this._maskBuffer, this._maskData)
        : helpers.emptyFunction;
    }
  }
);
AGL.Stage2D.createVertexShader = function(config) {
  var maxLightSources = config.lightNum;

  var shader =
  "#version 300 es\n" +

  "in vec2 aPos;" +
  "in mat4 aMt;" +
  "in vec4 aWrlCol;" +
  "in vec4 aTintCol;" +
  "in vec2 aAlpCol;" +
  (
    config.isMaskEnabled
    ? "in vec2 aMsk;"
    : ""
  ) +
  "in vec3 aFx;" +

  "out vec2 vTexCrd;" +
  (
    config.isMaskEnabled
    ? "out float vMskTexId;" +
      "flat out int vMskTp;" +
      "out vec2 vMskCrd;"
    : ""
  ) +
  "out vec4 vTexCrop;" +
  "out vec4 vWrlCol;" +
  "out vec4 vTintCol;" +
  "out float vAlpCol;" +
  "out float vTexId;" +
  "out float vTintTp;" +
  "out float vZId;" +
  "out vec2 vGlPos;";

  shader +=
  "void main(void){" +
    AGL.RendererHelper.calcGlPositions +
    "vGlPos=gl_Position.xy;" +
    "vWrlCol=aWrlCol;" +
    "vTintCol=vec4(aTintCol.rgb*aTintCol.a,1.-aTintCol.a);" +
    "vAlpCol=aAlpCol.x*aAlpCol.y;" +

    "vTexId=aFx.x;" +
    "vTintTp=aFx.y;" +
    "vZId=aFx.z;" +

    (
      config.isMaskEnabled
        ? "vMskTexId=aMsk.x;" +
          "vMskTp=int(aMsk.y);" +
          "vMskCrd=(vGlPos+vec2(1,-1))/vec2(2,-2);"
        : ""
    ) +

  "}";

  return shader;
};
AGL.Stage2D.createFragmentShader = function(config) {
  var maxTextureImageUnits = AGL.Utils.info.maxTextureImageUnits;
  var maxLightSources = config.lightNum;

  var shader =
  "#version 300 es\n" +
  "precision " + config.precision + " float;" +

  (
    config.isMaskEnabled
    ? "in float vMskTexId;" +
      "flat in int vMskTp;" +
      "in vec2 vMskCrd;"
    : ""
  ) +
  "in vec2 vTexCrd;" +
  "in vec4 vTexCrop;" +
  "in vec4 vWrlCol;" +
  "in vec4 vTintCol;" +
  "in float vAlpCol;" +
  "in float vTexId;" +
  "in float vTintTp;" +
  "in float vZId;" +
  "in vec2 vGlPos;" +

  (
    config.isLightEnabled
      ? "uniform mat4 uLg[" + maxLightSources + "];"
      : ""
  ) +

  "uniform sampler2D uTex[" + maxTextureImageUnits + "];" +

  "uniform vec4 uFog;" +

  "out vec4 fgCol;" +

  (
    config.isLightEnabled
      ? "vec4 lgVal(mat4 lg){" +
          "vec2 p=vGlPos*lg[1].xw+vGlPos.yx*lg[1].zy+lg[0].xy;" +
          "p*=p;" +
          "float dst=p.x+p.y;" +
          "return dst>1." +
            "?vec4(0)" +
            ":lg[2]*clamp((1.-sqrt(dst))*lg[3].x,0.,1.)*lg[3].y;" +
        "}"
      : ""
  ) +

  AGL.RendererHelper.createGetTextureFunction(maxTextureImageUnits) +

  "void main(void){" +
    AGL.RendererHelper.getTexColor +
    "if(vAlpCol==0.||fgCol.a==0.)discard;" +

    (
      config.isMaskEnabled
        ? "float mskA=1.;" +
          "if(vMskTexId>-1.){" +
            "vec4 mskCol=gtTexCol(vMskTexId,vMskCrd);" +
            "mskA=vMskTp<4" +
              "?mskCol[vMskTp]" +
              ":(mskCol.r+mskCol.g+mskCol.b+mskCol.a)/4.;" +
          "}"
        : ""
    ) +

    "fgCol.a*=vAlpCol" +
    (
      config.isMaskEnabled
        ? "*mskA"
        : ""
    ) +
    ";" +

    "if(fgCol.a==0.)discard;" +

    "if(vTintTp>0.){" +
      "vec3 col=vTintCol.rgb+fgCol.rgb*vTintCol.a;" +
      "if(vTintTp<2.||(vTintTp<3.&&fgCol.r==fgCol.g&&fgCol.r==fgCol.b))" +
        "fgCol.rgb*=col;" +
      "else if(vTintTp<4.) " +
        "fgCol.rgb=col;" +
    "}" +

    "vec4 lgCol=vec4(0);";

    if (config.isLightEnabled) {
      for (var i = 0; i < maxLightSources; ++i) {
        shader +=
        "if(uLg[" + i + "][0].w>0.&&uLg[" + i + "][0].z>vZId)" +
          "lgCol+=lgVal(uLg[" + i + "]);";
      }
    }

    shader +=
    "float colLgMult=clamp(uFog.a-lgCol.a,0.,1.);" +
    "fgCol.rgb*=1.-colLgMult;" +
    "fgCol=(fgCol*(vWrlCol+lgCol))+vec4(uFog.rgb*colLgMult,0);" +
  "}";

  return shader;
};
