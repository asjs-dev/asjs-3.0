require("../NameSpace.js");
require("./agl.BaseRenderer.js");
require("../display/agl.Item.js");
require("../utils/agl.Matrix3.js");

AGL.Stage2D = createPrototypeClass(
  AGL.BaseRenderer,
  function Stage2DRenderer(canvas, vertexShader, fragmentShader, config) {
    AGL.BaseRenderer.call(this, canvas, vertexShader, fragmentShader, {
      "a_fillCol"       : "getAttribLocation",
      "a_tintCol"       : "getAttribLocation",
      "a_fx"            : "getAttribLocation",
      "u_res"           : "getUniformLocation",
      "u_lightPos"      : "getUniformLocation",
      "u_lightVol"      : "getUniformLocation",
      "u_lightCol"      : "getUniformLocation",
      "u_lightFX"       : "getUniformLocation",
      "u_lightZIndices" : "getUniformLocation",
      "u_fog"           : "getUniformLocation",
      "u_filters"       : "getUniformLocation",
    }, config);

    this.fog = new AGL.ColorProps();
    this.fog.a = 0;

    this.colorCache = this.color.items;

    this._DEFAULT_DUO  = [0, 0];
    this._DEFAULT_QUAD = [0, 0, 0, 0];

    this._widthHalf  = 0;
    this._heightHalf = 0;

    this._attachedLights = [];

    this._picked;
    this._isPickerSet = false;

    this._tmpPickerVector  = new Float32Array([0, 0, 1]);
    this._tmpMatrix        = new Float32Array(6);
    this._tmpInverseMatrix = new Float32Array(6);

    if (this._config.isLightEnabled) {
      this._lightPositions = new Float32Array(this._config.lightNum * 2);
      this._lightVolumes   = new Float32Array(this._config.lightNum * 2);
      this._lightColors    = new Float32Array(this._config.lightNum * 4);
      this._lightEffects   = new Float32Array(this._config.lightNum * 4);
      this._lightZIndices  = new Int32Array(this._config.lightNum);
    }
    this._collectLightsFunc = this._config.isLightEnabled
      ? this._collectLights.bind(this)
      : emptyFunction;

    this._colorData       = new Float32Array(this._MAX_BATCH_ITEMS * 4);
    this._colorBuffer     = this._createArBuf(this._colorData,     "a_fillCol", 4, 1, 4, this._gl.FLOAT, 4);
    this._tintColorData   = new Float32Array(this._MAX_BATCH_ITEMS * 4);
    this._tintColorBuffer = this._createArBuf(this._tintColorData, "a_tintCol", 4, 1, 4, this._gl.FLOAT, 4);

    this._effectLength = (this._config.isMaskEnabled ? 4 : 3);
    this._effectData   = new Float32Array(this._MAX_BATCH_ITEMS * this._effectLength);
    this._effectBuffer = this._createArBuf(this._effectData, "a_fx", this._effectLength, 1, this._effectLength, this._gl.FLOAT, 4);

    this._setMaskDataFunc = this._config.isMaskEnabled
      ? this._setMaskData.bind(this)
      : emptyFunction;

    this._zIndexCounter = 0;

    this._resize();
  },
  function(_super) {
    set(this, "filters", function(f) {
      this._config.filters && this._config.filters.length > 0 && this._gl.uniform1i(this._locations["u_filters"], f);
    });

    get(this, "picked", function() { return this._picked; });

    this.render = function() {
      this._resize();

      this._picked = null;
      this._zIndexCounter = 0;

      this._updateColor();
      this._updateFog();
      this._collectLightsFunc();

      this._render();

      this._isPickerSet = false;
    }

    this.isLightAttached = function(light) {
      return this._attachedLights.has(light);
    }

    this.attachLight = function(light) {
      !this.isLightAttached(light) &&
      this._attachedLights.length < this._config.lightNum &&
      this._attachedLights.push(light);
    }

    this.detachLight = function(light) {
      this._attachedLights.remove(light);
    }

    this.setPickerPoint = function(x, y) {
      this._isPickerSet = true;

      this._tmpPickerVector[0] = (x - this._widthHalf) * this.matrixCache[0];
      this._tmpPickerVector[1] = (y - this._heightHalf) * this.matrixCache[4];
    }

    this._updateFog = function() {
      this.fog.isUpdated() && this._gl.uniform4fv(this._locations["u_fog"], this.fog.items);
    }

    this._collectLights = function() {
      var light;
      var duoId;
      var quadId;
      var i;
      var l;
      for (i = 0, l = this._config.lightNum; i < l; ++i) {
        duoId  = i * 2;
        quadId = i * 4;
        if (i >= this._attachedLights.length || !this._attachedLights[i].renderable) {
          arraySet(this._lightPositions, this._DEFAULT_DUO,  duoId);
          arraySet(this._lightVolumes,   this._DEFAULT_DUO,  duoId);
          arraySet(this._lightColors,    this._DEFAULT_QUAD, quadId);
          arraySet(this._lightEffects,   this._DEFAULT_QUAD, quadId);
          this._lightZIndices[i] = -1;
        } else {
          light = this._attachedLights[i];
          arraySet(this._lightPositions, light.positionCache, duoId);
          arraySet(this._lightVolumes,   light.volumeCache,   duoId);
          arraySet(this._lightColors,    light.colorCache,    quadId);
          arraySet(this._lightEffects,   light.effectCache,   quadId);
          this._lightZIndices[i] = light.props.zIndex;
        }
      }

      light = null;

      this._gl.uniform2fv(this._locations["u_lightPos"], this._lightPositions);
      this._gl.uniform2fv(this._locations["u_lightVol"],   this._lightVolumes);
      this._gl.uniform4fv(this._locations["u_lightCol"],    this._lightColors);
      this._gl.uniform4fv(this._locations["u_lightFX"],   this._lightEffects);
      this._gl.uniform1fv(this._locations["u_lightZIndices"],  this._lightZIndices);
    }

    this._drawItem = function(item, parent) {
      if (!item.renderable) return;
      item.props.zIndex = ++this._zIndexCounter;
      item.update(this._renderTimer, parent);
      item.type !== AGL.Item.TYPE && this._drawFunctionMap[item.type](item, parent);
    }

    this._setMaskData = function(item) {
      item.mask && (this._effectData[this._batchItems * this._effectLength + 3] = this._drawTex(item.mask));
    }

    this._setBufDat = function(item, parent, textureMapIndex, matId, quadId, effectId) {
      _super._setBufDat.call(this, item, parent, textureMapIndex, matId, quadId);

      arraySet(this._colorData,     parent.colorCache, quadId);
      arraySet(this._tintColorData, item.colorCache,   quadId);

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
          this._tmpPickerVector,
          parent.matrixCache,
          item.matrixCache,
          this._tmpMatrix,
          this._tmpInverseMatrix
        )
      ) this._picked = item;

      this._setMaskDataFunc(item);

      var textureMapIndex = this._drawTex(item.texture);

      this._setBufDat(
        item,
        parent,
        textureMapIndex,
        this._batchItems * 9,
        this._batchItems * 4,
        this._batchItems * this._effectLength
      );

      ++this._batchItems === this._MAX_BATCH_ITEMS && this._batchDraw();
    }

    this._bindBufs = function() {
      _super._bindBufs.call(this);
  		this._bindArBuf(this._colorBuffer,     this._colorData);
      this._bindArBuf(this._tintColorBuffer, this._tintColorData);
      this._bindArBuf(this._effectBuffer,    this._effectData);
    }

    this._resize = function() {
      if (_super._resize.call(this)) {
        this._widthHalf  = this._width * 0.5;
        this._heightHalf = this._height * 0.5;
        this._gl.uniform2f(this._locations["u_res"], this._width / this._height, 100 / this._width);
      }
    }

    this._updateColor = function() {
      this.color.isUpdated() && this.worldColorUpdateId++;
    }
  }
);
AGL.Stage2D.MAX_LIGHT_SOURCES = 16;
AGL.Stage2D.Filters = {
  "NONE"       : 0,
  "GRAYSCALE"  : 1,
  "SEPIA"      : 2,
  "INVERT"     : 4,
  "COLORLIMIT" : 8,
  "VIGNETTE"   : 16,
  "RAINBOW"    : 32,
  "LINES"      : 64,
};
AGL.Stage2D.createVertexShader = function(config) {
  var maxLightSources = config.lightNum;

  var shader = "#version 300 es\n";

  if (config.isLightEnabled) {
    shader +=
    "#define MAX_LIGHT_SOURCES " + maxLightSources + "\n";
  }

  shader +=
  "in vec2 a_pos;" +
  "in mat3 a_mat;" +
  "in mat3 a_worldMat;" +
  "in mat3 a_texMat;" +
  "in vec4 a_texCrop;" +
  "in vec4 a_fillCol;" +
  "in vec4 a_tintCol;" +
  "in vec" + (config.isMaskEnabled ? "4" : "3") + " a_fx;";

  shader +=
  "uniform vec2 u_res;" +
  "uniform vec4 u_fog;";

  if (config.isLightEnabled) {
    shader +=
    "uniform vec2 u_lightPos[MAX_LIGHT_SOURCES];" +
    "uniform vec2 u_lightVol[MAX_LIGHT_SOURCES];" +
    "uniform vec4 u_lightCol[MAX_LIGHT_SOURCES];" +
    "uniform vec4 u_lightFX[MAX_LIGHT_SOURCES];" +
    "uniform float u_lightZIndices[MAX_LIGHT_SOURCES];";
  }

  shader +=
  "out vec2 v_texCoord;" +
  "out vec4 v_coord;" +
  "out vec2 v_texCrop;" +
  "out vec2 v_texCropSize;" +
  "out vec4 v_fillCol;" +
  "out vec4 v_tintCol;" +
  "out float v_texId;" +
  "out float v_tintType;" +
  "out float v_colMult;" +
  "out vec4 v_fogCol;";

  if (config.isMaskEnabled) shader += "out float v_maskTexId;";

  if (config.isLightEnabled) {
    shader +=
    "vec4 lightVal(vec4 pos,vec2 lightPos,vec2 lightVol,vec4 lightCol,vec4 lightFX){" +
      "vec2 dist=pos.xy-lightPos;" +
      "return lightCol*lightCol.a*max(0.0,min(1.0,1.0-sqrt(" +
        "pow(abs(dist.x+(abs(dist.x)*lightFX.x)),lightFX.z)*(lightVol.x/u_res.y)+" +
        "pow(abs(dist.y+(abs(dist.y)*lightFX.y)),lightFX.w)*(lightVol.y/u_res.x/u_res.y)" +
      ")));" +
    "}";
  }

  shader +=
  "void main(void){" +
    "vec3 pos=vec3(a_pos,1.0);" +
    "gl_Position=vec4((a_worldMat*a_mat*pos).xy,0.0,1.0);" +
    "v_texCoord=(a_texMat*pos).xy;" +
    "v_coord=gl_Position;" +
    "v_texCrop=a_texCrop.xy;" +
    "v_texCropSize=a_texCrop.zw-a_texCrop.xy;" +
    "v_fillCol=a_fillCol;" +
    "v_tintCol=a_tintCol;" +

    "v_texId=a_fx.x;" +
    "v_tintType=a_fx.y;";

    shader +=
    "vec4 lightCol=vec4(0.0);";

    if (config.isLightEnabled) {
      for (var i = 0; i < maxLightSources; i++) {
        shader +=
        "if(u_lightCol[" + i + "].a>0.0 && u_lightZIndices[" + i + "]>a_fx.z){" +
          "lightCol+=lightVal(" +
            "v_coord," +
            "u_lightPos[" + i + "]," +
            "u_lightVol[" + i + "]," +
            "u_lightCol[" + i + "]," +
            "u_lightFX[" + i + "]" +
          ");" +
        "}";
      }
    }

    shader +=
    "float colLightMult=max(0.0,u_fog.a-lightCol.a);" +
    "v_colMult=max(0.0,1.0-colLightMult);" +
    "v_fogCol=vec4(u_fog.rgb*colLightMult,0.0);" +
    "v_fillCol+=lightCol;";

    if (config.isMaskEnabled) shader += "v_maskTexId=a_fx.w;";

    shader += "}";

  return shader;
};
AGL.Stage2D.createFragmentShader = function(config) {
  var maxTextureImageUnits = config.textureNum;

  var shader = "#version 300 es\n" +
  "#define MAX_TEXTURES " + maxTextureImageUnits + "\n";

  shader +=
  "precision lowp float;" +

  "in vec4 v_coord;" +
  "in vec2 v_texCoord;" +
  "in vec2 v_texCrop;" +
  "in vec2 v_texCropSize;" +
  "in vec4 v_fillCol;" +
  "in vec4 v_tintCol;" +
  "in float v_texId;" +
  "in float v_tintType;" +
  "in float v_colMult;" +
  "in vec4 v_fogCol;";

  if (config.isMaskEnabled) shader += "in float v_maskTexId;";

  shader +=
  "uniform sampler2D u_tex[MAX_TEXTURES];";

  if (config.isFilterEnabled)
  shader += "uniform int u_filters;";

  shader += "out vec4 fgCol;";

  shader +=
  "void main(void){";

    if (config.isMaskEnabled) {
      shader +=
      "float maskAlpha=1.0;" +
      "if(v_maskTexId>0.0){";
        for (var i = 0; i < maxTextureImageUnits; i++) {
          shader += (i > 0 ? " else " : "") +
          "if(v_maskTexId<" + (i + 1) + ".5){" +
            "maskAlpha=texture(u_tex[" + i + "],(v_coord.xy+vec2(1.0,-1.0))/vec2(2.0,-2.0)).r;" +
            "if(maskAlpha==0.0) discard;" +
          "}";
        }
      shader +=
      "}";
    }

    for (var i = -1; i < maxTextureImageUnits; i++) {
      shader += (i > -1 ? " else " : "") +
      "if(v_texId<" + (i + 1) + ".5){";
        shader += "fgCol=" + (
          i < 0
            ? "vec4(0.0,0.0,0.0,0.0);"
            : "texture(u_tex[" + i + "],v_texCrop+v_texCropSize*fract(v_texCoord));"
          );
      shader +=
        "if(fgCol.a==0.0) discard;" +
      "}";
    }

    shader +=
    "if(fgCol.a>0.0){" +
      "if(v_tintType<0.5) " +
        "fgCol*=v_tintCol;" +
      "else if(v_tintType<1.5 && fgCol.r==fgCol.g && fgCol.r==fgCol.b) " +
        "fgCol*=v_tintCol;" +
      "else if(v_tintType<2.5) " +
        "fgCol=vec4((fgCol.rgb*(1.0-v_tintCol.a))+(v_tintCol.rgb*v_tintCol.a),fgCol.a);";

      shader +=
      "vec4 finalCol=vec4(fgCol.rgb*v_colMult,fgCol.a);" +
      "fgCol=(finalCol*v_fillCol)+v_fogCol;";

      if (config.isFilterEnabled) {
        shader += "if(u_filters>0 && fgCol.a>0.0){";
        for (var i = 0; i < config.filters.length; i++) {
          shader += "if((" + config.filters[i] + " & u_filters)>0){";
            switch (config.filters[i]) {
              case AGL.Stage2D.Filters.GRAYSCALE:
                shader +=
                "fgCol=vec4(" +
                  "vec3(1.0)*((fgCol.r+fgCol.g+fgCol.b)/3.0)," +
                  "fgCol.a" +
                ");";
              break;
              case AGL.Stage2D.Filters.SEPIA:
                shader +=
                "fgCol=vec4(" +
                  "vec3(0.874,0.514,0.156)*((fgCol.r+(fgCol.g+fgCol.b))/3.0)," +
                  "fgCol.a" +
                ");";
              break;
              case AGL.Stage2D.Filters.INVERT:
                shader +=
                "fgCol=abs(vec4(fgCol.rgb-1.0,fgCol.a));";
              break;
              case AGL.Stage2D.Filters.COLORLIMIT:
                shader +=
                "fgCol=vec4(" +
                  "(floor((fgCol.rgb*256.0)/32.0)/256.0)*32.0," +
                  "fgCol.a" +
                ");";
              break;
              case AGL.Stage2D.Filters.VIGNETTE:
                shader +=
                "float vignetteValue=(1.0-sqrt(pow(v_coord.x,4.0)+pow(v_coord.y,4.0)));" +
                "fgCol*=vec4(vec3(vignetteValue),1);";
              break;
              case AGL.Stage2D.Filters.RAINBOW:
                shader +=
                "fgCol+=vec4(v_coord.x*0.15,v_coord.y*0.15,(v_coord.x-v_coord.y)*0.15,0);";
              break;
              case AGL.Stage2D.Filters.LINES:
                shader += "fgCol+=vec4(sin(v_coord.y*500.0)*0.2);";
              break;
            }
          shader += "}";
        }
        shader += "}";
      }
      if (config.isMaskEnabled) shader += "fgCol.a*=maskAlpha;";

      shader +=
    "}" +
  "}";

  return shader;
};
