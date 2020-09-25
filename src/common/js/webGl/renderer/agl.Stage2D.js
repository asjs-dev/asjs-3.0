require("../NameSpace.js");
require("./agl.BaseRenderer.js");
require("../display/agl.Item.js");
require("../utils/agl.Matrix3.js");

AGL.Stage2D = helpers.createPrototypeClass(
  AGL.BaseRenderer,
  function Stage2DRenderer(config) {
    config.vertexShader   = config.vertexShader   || AGL.Stage2D.createVertexShader;
    config.fragmentShader = config.fragmentShader || AGL.Stage2D.createFragmentShader;
    config.locations      = Object.assign(config.locations, {
      "aFillCol"      : "getAttribLocation",
      "aTintCol"      : "getAttribLocation",
      "aFx"           : "getAttribLocation",
      "uRes"          : "getUniformLocation",
      "uLghtPos"      : "getUniformLocation",
      "uLghtVol"      : "getUniformLocation",
      "uLghtCol"      : "getUniformLocation",
      "uLghtFX"       : "getUniformLocation",
      "uLghtZIndices" : "getUniformLocation",
      "uFog"          : "getUniformLocation",
      "uMskTp"        : "getUniformLocation",
    });

    AGL.BaseRenderer.call(this, config);

    this.fog = new AGL.ColorProps();
    this.fog.a = 0;

    this.colorCache = this.color.items;

    this._DEFAULT_DUO  = [0, 0];
    this._DEFAULT_QUAD = [0, 0, 0, 0];

    this._zIndexCounter =
    this._maskType      =
    this._widthHalf     =
    this._heightHalf    = 0;

    this._lights = [];

    this._picked;
    this._isPickerSet = false;

    this._tempPickerVector  = new Float32Array([0, 0, 1]);
    this._tempMatrix        = new Float32Array(6);
    this._tempInverseMatrix = new Float32Array(6);

    this._collectLightsFunc = helpers.emptyFunction;
    if (this._config.isLightEnabled) {
      this._lightPositions = new Float32Array(this._config.lightNum * 2);
      this._lightVolumes   = new Float32Array(this._config.lightNum * 2);
      this._lightColors    = new Float32Array(this._config.lightNum * 4);
      this._lightEffects   = new Float32Array(this._config.lightNum * 4);
      this._lightZIndices  = new Int32Array(this._config.lightNum);

      for (var i = 0, l = this._config.lightNum; i < l; ++i) {
        this._lights.push(new AGL.Light(
          i,
          this._lightPositions,
          this._lightVolumes,
          this._lightColors,
          this._lightEffects,
          this._lightZIndices
        ));
      }

      this._collectLightsFunc = this._collectLights.bind(this);
    }

    this._setMaskDataFunc = this._config.isMaskEnabled
      ? this._setMaskData.bind(this)
      : helpers.emptyFunction;

    this._resize();
  },
  function(_super) {
    helpers.get(this, "picked", function() { return this._picked; });

    helpers.property(this, "maskType", {
      get: function() { return this._maskType; },
      set: function(v) {
        if (this._maskType === v) return;
        this._maskType = v;
        this._gl.uniform1i(this._locations["uMskTp"], this._maskType);
      }
    });

    this.destruct = function() {
      this.fog                =
      this.colorCache         =
      this._DEFAULT_DUO       =
      this._DEFAULT_QUAD      =
      this._lights            =
      this._picked            =
      this._tempPickerVector  =
      this._tempMatrix        =
      this._tempInverseMatrix =
      this._collectLightsFunc =
      this._lightPositions    =
      this._lightVolumes      =
      this._lightColors       =
      this._lightEffects      =
      this._lightZIndices     =
      this._collectLightsFunc =
      this._setMaskDataFunc   = null;

      _super.destruct.call(this);
    }

    this.render = function() {
      this._preRender();

      this._picked = null;
      this._zIndexCounter = 0;

      this._updateColor();
      this._updateFog();
      this._collectLightsFunc();

      this._render();

      this._isPickerSet = false;
    }

    this.getLight = function(id) {
      return this._lights[id];
    }

    this.setPickerPoint = function(x, y) {
      this._isPickerSet = true;

      this._tempPickerVector[0] = (x - this._widthHalf) * this.matrixCache[0];
      this._tempPickerVector[1] = (y - this._heightHalf) * this.matrixCache[4];
    }

    this._updateFog = function() {
      this.fog.isUpdated() && this._gl.uniform4fv(this._locations["uFog"], this.fog.items);
    }

    this._collectLights = function() {
      this._gl.uniform2fv(this._locations["uLghtPos"],      this._lightPositions);
      this._gl.uniform2fv(this._locations["uLghtVol"],      this._lightVolumes);
      this._gl.uniform4fv(this._locations["uLghtCol"],      this._lightColors);
      this._gl.uniform4fv(this._locations["uLghtFX"],       this._lightEffects);
      this._gl.uniform1fv(this._locations["uLghtZIndices"], this._lightZIndices);
    }

    this._drawItem = function(item, parent) {
      if (!item.renderable) return;
      item.props.zIndex = ++this._zIndexCounter;
      item.update(this._renderTime, parent);
      item.type !== AGL.Item.TYPE && this._drawFunctionMap[item.type](item, parent);
    }

    this._setMaskData = function(item) {
      item.mask && (this._effectData[this._batchItems * this._effectLength + 3] = this._drawTexture(item.mask));
    }

    this._setBufferData = function(item, parent, textureMapIndex, matId, quadId, effectId) {
      _super._setBufferData.call(this, item, parent, textureMapIndex, matId, quadId);

      helpers.arraySet(this._colorData,     parent.colorCache, quadId);
      helpers.arraySet(this._tintColorData, item.colorCache,   quadId);

      this._effectData[effectId] = textureMapIndex;
      this._effectData[effectId + 1] = item.tintType;
      this._effectData[effectId + 2] = item.props.zIndex;
    }

    this._drawImage = function(item, parent) {
      this._checkBlendMode(item);

      if (
        this._isPickerSet &&
        item.interactive &&
        AGL.Matrix3.isPointInMatrix(
          this._tempPickerVector,
          parent.matrixCache,
          item.matrixCache,
          this._tempMatrix,
          this._tempInverseMatrix
        )
      ) this._picked = item;

      this._setMaskDataFunc(item);

      var textureMapIndex = this._drawTexture(item.texture);

      this._setBufferData(
        item,
        parent,
        textureMapIndex,
        this._batchItems * 9,
        this._batchItems * 4,
        this._batchItems * this._effectLength
      );

      ++this._batchItems === this._MAX_BATCH_ITEMS && this._batchDraw();
    }

    this._bindBuffers = function() {
      _super._bindBuffers.call(this);
  		this._bindArrayBuffer(this._colorBuffer,     this._colorData);
      this._bindArrayBuffer(this._tintColorBuffer, this._tintColorData);
      this._bindArrayBuffer(this._effectBuffer,    this._effectData);
    }

    this._resize = function() {
      if (!_super._resize.call(this)) return;
      this._widthHalf  = this._width * 0.5;
      this._heightHalf = this._height * 0.5;
      this._gl.uniform2f(this._locations["uRes"], this._width / this._height, 100 / this._width);
    }

    this._updateColor = function() {
      this.color.isUpdated() && this.worldColorUpdateId++;
    }

    this._initCustom = function() {
      _super._initCustom.call(this);

      this._colorData       = new Float32Array(this._MAX_BATCH_ITEMS * 4);
      this._colorBuffer     = this._createArrayBuffer(this._colorData,     "aFillCol", 4, 1, 4, AGL.Consts.FLOAT, 4);
      this._tintColorData   = new Float32Array(this._MAX_BATCH_ITEMS * 4);
      this._tintColorBuffer = this._createArrayBuffer(this._tintColorData, "aTintCol", 4, 1, 4, AGL.Consts.FLOAT, 4);

      this._effectLength = (this._config.isMaskEnabled ? 4 : 3);
      this._effectData   = new Float32Array(this._MAX_BATCH_ITEMS * this._effectLength);
      this._effectBuffer = this._createArrayBuffer(this._effectData, "aFx", this._effectLength, 1, this._effectLength, AGL.Consts.FLOAT, 4);
    }
  }
);
helpers.constant(AGL.Stage2D, "MASK_TYPES", {
  "RED"   : 0,
  "GREEN" : 1,
  "BLUE"  : 2,
  "ALPHA" : 3,
  "AVG"   : 4,
});
helpers.constant(AGL.Stage2D, "MAX_LIGHT_SOURCES", 16);
AGL.Stage2D.createVertexShader = function(config) {
  var maxLightSources = config.lightNum;

  var shader = "#version 300 es\n";

  shader +=
  "in vec2 aPos;" +
  "in mat3 aMat;" +
  "in mat3 aWorldMat;" +
  "in mat3 aTexMat;" +
  "in vec4 aTexCrop;" +
  "in vec4 aFillCol;" +
  "in vec4 aTintCol;" +
  "in vec" + (config.isMaskEnabled ? "4" : "3") + " aFx;";

  shader +=
  "uniform vec2 uRes;" +
  "uniform vec4 uFog;";

  if (config.isLightEnabled) {
    shader +=
    "uniform vec2 uLghtPos[" + maxLightSources + "];" +
    "uniform vec2 uLghtVol[" + maxLightSources + "];" +
    "uniform vec4 uLghtCol[" + maxLightSources + "];" +
    "uniform vec4 uLghtFX[" + maxLightSources + "];" +
    "uniform float uLghtZIndices[" + maxLightSources + "];";
  }

  shader +=
  "out vec2 vTexCrd;" +
  "out vec4 vCrd;" +
  "out vec2 vMskCrd;" +
  "out vec2 vTexCrop;" +
  "out vec2 vTexCropSize;" +
  "out vec4 vFillCol;" +
  "out vec4 vTintCol;" +
  "out float vTexId;" +
  "out float vTintType;" +
  "out float vColMult;" +
  "out vec4 vFogCol;";

  if (config.isMaskEnabled) shader += "out float vMskTexId;";

  if (config.isLightEnabled) {
    shader +=
    "vec4 lghtVal(vec4 pos,vec2 lghtPos,vec2 lghtVol,vec4 lghtCol,vec4 lghtFX){" +
      "vec2 dist=abs(pos.xy-lghtPos);" +
      "vec2 v=pow(dist+(dist*lghtFX.xy),lghtFX.zw);"+
      "return lghtCol*lghtCol.a*max(0.,min(1.,1.-sqrt(" +
        "v.x*(lghtVol.x/uRes.y)+" +
        "v.y*(lghtVol.y/uRes.x/uRes.y)" +
      ")));" +
    "}";
  }

  shader +=
  "void main(void){" +
    "vec3 pos=vec3(aPos,1);" +
    "gl_Position=vec4((aWorldMat*aMat*pos).xy,0,1);" +
    "vTexCrd=(aTexMat*pos).xy;" +
    "vCrd=gl_Position;" +
    "vMskCrd=(vCrd.xy+vec2(1,-1))/vec2(2,-2);" +
    "vTexCrop=aTexCrop.xy;" +
    "vTexCropSize=aTexCrop.zw;" +
    "vFillCol=aFillCol;" +
    "vTintCol=aTintCol;" +

    "vTexId=aFx.x;" +
    "vTintType=aFx.y;";

    shader +=
    "vec4 lghtCol=vec4(0);";

    if (config.isLightEnabled) {
      for (var i = 0; i < maxLightSources; i++) {
        shader +=
        "if(uLghtCol[" + i + "].a>0. && uLghtZIndices[" + i + "]>aFx.z){" +
          "lghtCol+=lghtVal(" +
            "vCrd," +
            "uLghtPos[" + i + "]," +
            "uLghtVol[" + i + "]," +
            "uLghtCol[" + i + "]," +
            "uLghtFX[" + i + "]" +
          ");" +
        "}";
      }
    }

    shader +=
    "float colLghtMult=max(0.,uFog.a-lghtCol.a);" +
    "vColMult=max(0.,1.-colLghtMult);" +
    "vFogCol=vec4(uFog.rgb*colLghtMult,0);" +
    "vFillCol+=lghtCol;";

    if (config.isMaskEnabled) shader += "vMskTexId=aFx.w;";

    shader += "}";

  return shader;
};
AGL.Stage2D.createFragmentShader = function(config) {
  var maxTextureImageUnits = config.textureNum;

  var shader = "#version 300 es\n" +
  "precision highp float;" +

  "in vec4 vCrd;" +
  "in vec2 vMskCrd;" +
  "in vec2 vTexCrd;" +
  "in vec2 vTexCrop;" +
  "in vec2 vTexCropSize;" +
  "in vec4 vFillCol;" +
  "in vec4 vTintCol;" +
  "in float vTexId;" +
  "in float vTintType;" +
  "in float vColMult;" +
  "in vec4 vFogCol;";

  if (config.isMaskEnabled) shader += "in float vMskTexId;";

  shader +=
  "uniform sampler2D uTex[" + maxTextureImageUnits + "];" +
  "uniform int uMskTp;";

  shader += "out vec4 fgCol;";

  shader +=
  "void main(void){";

    if (config.isMaskEnabled) {
      shader +=
      "float mskAlpha=1.;" +
      "if(vMskTexId>0.){";
        for (var i = 0; i < maxTextureImageUnits; i++) {
          shader += (i > 0 ? " else " : "") +
          "if(vMskTexId<" + (i + 1) + ".5){" +
            "vec4 mskCol=texture(uTex[" + i + "],vMskCrd);" +
            "if(uMskTp<1)mskAlpha=mskCol.r;" +
            "else if(uMskTp<2)mskAlpha=mskCol.g;" +
            "else if(uMskTp<3)mskAlpha=mskCol.b;" +
            "else if(uMskTp<4)mskAlpha=mskCol.a;" +
            "else if(uMskTp<5)mskAlpha=(mskCol.r+mskCol.g+mskCol.b+mskCol.a)/4.;" +
            "if(mskAlpha<0.01)discard;" +
          "}";
        }
      shader +=
      "}";
    }

    for (var i = -1; i < maxTextureImageUnits; i++) {
      shader += (i > -1 ? " else " : "") +
      "if(vTexId<" + (i + 1) + ".5){";
        shader += "fgCol=" + (
          i < 0
            ? "vec4(0);"
            : "texture(uTex[" + i + "],vTexCrop+vTexCropSize*mod(vTexCrd,1.));"
          );
      shader +=
        "if(fgCol.a==0.) discard;" +
      "}";
    }

    shader +=
    "if(fgCol.a>.0){" +
      "if(vTintType<.5||(vTintType<1.5 && fgCol.r==fgCol.g && fgCol.r==fgCol.b)) " +
        "fgCol*=vTintCol;" +
      "else if(vTintType<2.5) " +
        "fgCol=vec4(vTintCol.rgb,fgCol.a*vTintCol.a);";

      shader +=
      "vec4 finalCol=vec4(fgCol.rgb*vColMult,fgCol.a);" +
      "fgCol=(finalCol*vFillCol)+vFogCol;";

      if (config.isMaskEnabled) shader += "fgCol.a*=mskAlpha;";

      shader +=
    "}" +
  "}";

  return shader;
};
