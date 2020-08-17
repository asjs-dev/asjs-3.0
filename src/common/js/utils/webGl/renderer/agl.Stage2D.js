require("../NameSpace.js");
require("./agl.BaseRenderer.js");
require("../display/agl.Item.js");
require("../utils/agl.Matrix3.js");

AGL.Stage2D = createPrototypeClass(
  AGL.BaseRenderer,
  function Stage2DRenderer(webGlBitmap, vertexShader, fragmentShader, config) {
    AGL.BaseRenderer.call(this, webGlBitmap, vertexShader, fragmentShader, {
      "a_position"       : "getAttribLocation",
      "a_matrix"         : "getAttribLocation",
      "a_worldMatrix"    : "getAttribLocation",
      "a_texMatrix"      : "getAttribLocation",
      "a_texCrop"        : "getAttribLocation",
      "a_fillColor"      : "getAttribLocation",
      "a_tintColor"      : "getAttribLocation",
      "a_effects"        : "getAttribLocation",
      "u_resolution"     : "getUniformLocation",
      "u_tex"            : "getUniformLocation",
      "u_lightPositions" : "getUniformLocation",
      "u_lightVolumes"   : "getUniformLocation",
      "u_lightColors"    : "getUniformLocation",
      "u_lightEffects"   : "getUniformLocation",
      "u_lightZIndices"  : "getUniformLocation",
      "u_fog"            : "getUniformLocation",
      "u_filters"        : "getUniformLocation",
    }, config);

    this.fog = new AGL.ColorProps();
    this.fog.a = 0;

    this.colorCache = this.color.items;

    this._DEFAULT_DUO  = [0, 0];
    this._DEFAULT_QUAD = [0, 0, 0, 0];

    this._attachedLights = [];

    this._pickedElements = [];
    this._isPickerSet = false;

    this._tempPickerVector  = new Float32Array([0, 0, 1]);
    this._tempMatrix        = new Float32Array(6);
    this._tempInverseMatrix = new Float32Array(6);

    if (this._config.isLightEnabled) {
      this._lightPositions = new Float32Array(this._config.lightsNum * 2);
      this._lightVolumes   = new Float32Array(this._config.lightsNum * 2);
      this._lightColors    = new Float32Array(this._config.lightsNum * 4);
      this._lightEffects   = new Float32Array(this._config.lightsNum * 4);
      this._lightZIndices  = new Int32Array(this._config.lightsNum);
    }
    this._collectLightsFunc = this._config.isLightEnabled
      ? this._collectLights.bind(this)
      : emptyFunction;

    this._colorData       = new Float32Array(this._MAX_BATCH_ITEMS * 4);
    this._colorBuffer     = this._createArrayBuffer(this._colorData,     "a_fillColor", 4, 1, 4, this._gl.FLOAT, 4);
    this._tintColorData   = new Float32Array(this._MAX_BATCH_ITEMS * 4);
    this._tintColorBuffer = this._createArrayBuffer(this._tintColorData, "a_tintColor", 4, 1, 4, this._gl.FLOAT, 4);

    this._effectLength = (this._config.isMaskEnabled ? 4 : 3);
    this._effectData   = new Float32Array(this._MAX_BATCH_ITEMS * this._effectLength);
    this._effectBuffer = this._createArrayBuffer(this._effectData, "a_effects", this._effectLength, 1, this._effectLength, this._gl.FLOAT, 4);

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

    get(this, "pickedElements", function() { return this._pickedElements.clone(); });

    this.render = function() {
      this._resize();

      this._pickedElements.length = 0;
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
      this._attachedLights.length < this._config.lightsNum &&
      this._attachedLights.push(light);
    }

    this.detachLight = function(light) {
      this._attachedLights.remove(light);
    }

    this.setPickerPoint = function(x, y) {
      this._isPickerSet = true;

      this._tempPickerVector[0] = (x - this._widthHalf) * this.matrixCache[0];
      this._tempPickerVector[1] = (y - this._heightHalf) * this.matrixCache[4];
    }

    this._updateFog = function() {
      this.fog.isUpdated() && this._gl.uniform4fv(this._locations["u_fog"], this.fog.items);
    }

    this._collectLights = function() {
      var light;
      var douId;
      var quadId;
      var i;
      var l;
      for (i = 0, l = this._config.lightsNum; i < l; ++i) {
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

      this._gl.uniform2fv(this._locations["u_lightPositions"], this._lightPositions);
      this._gl.uniform2fv(this._locations["u_lightVolumes"],   this._lightVolumes);
      this._gl.uniform4fv(this._locations["u_lightColors"],    this._lightColors);
      this._gl.uniform4fv(this._locations["u_lightEffects"],   this._lightEffects);
      this._gl.uniform1fv(this._locations["u_lightZIndices"],  this._lightZIndices);
    }

    this._drawItem = function(item, parent) {
      if (!item.renderable) return;
      item.props.zIndex = ++this._zIndexCounter;
      item.update(this._renderTimer, parent);
      item.type !== AGL.Item.TYPE && this._drawFunctionMap[item.type](item, parent);
    }

    this._setMaskData = function(item) {
      item.mask && (this._effectData[this._batchItems * this._effectLength + 3] = this._drawTexture(item.mask));
    }

    this._setBufferData = function(item, parent, textureMapIndex, matId, quadId, effectId) {
      _super._setBufferData.call(this, item, parent, textureMapIndex, matId, quadId);

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
        AGL.Matrix3.isPointInMatrix(this._tempPickerVector, parent.matrixCache, item.matrixCache, this._tempMatrix, this._tempInverseMatrix)
      ) this._pickedElements.push(item);

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
      var resized = _super._resize.call(this);
      resized && this._gl.uniform2f(this._locations["u_resolution"], this._width / this._height, 100 / this._width);
    }

    this._updateColor = function() {
      this.color.isUpdated() && this.worldColorUpdateId++;
    }
  }
);
cnst(AGL.Stage2D, "MAX_LIGHT_SOURCES", 16);
cnst(AGL.Stage2D, "Filters", {
  "NONE"       : 0,
  "GRAYSCALE"  : 1,
  "SEPIA"      : 2,
  "INVERT"     : 4,
  "COLORLIMIT" : 8,
  "VIGNETTE"   : 16,
  "RAINBOW"    : 32,
  "LINES"      : 64,
});
rof(AGL.Stage2D, "createVertexShader", function(config) {
  var maxLightSources = config.lightsNum;

  var shader = "#version 300 es\n";

  if (config.isLightEnabled) {
    shader +=
    "#define MAX_LIGHT_SOURCES " + maxLightSources + "\n";
  }

  shader +=
  "in vec2 a_position;" +
  "in mat3 a_matrix;" +
  "in mat3 a_worldMatrix;" +
  "in mat3 a_texMatrix;" +
  "in vec4 a_texCrop;" +
  "in vec4 a_fillColor;" +
  "in vec4 a_tintColor;" +
  "in vec" + (config.isMaskEnabled ? "4" : "3") + " a_effects;";

  shader +=
  "uniform vec2 u_resolution;" +
  "uniform vec4 u_fog;";

  if (config.isLightEnabled) {
    shader +=
    "uniform vec2 u_lightPositions[MAX_LIGHT_SOURCES];" +
    "uniform vec2 u_lightVolumes[MAX_LIGHT_SOURCES];" +
    "uniform vec4 u_lightColors[MAX_LIGHT_SOURCES];" +
    "uniform vec4 u_lightEffects[MAX_LIGHT_SOURCES];" +
    "uniform float u_lightZIndices[MAX_LIGHT_SOURCES];";
  }

  shader +=
  "out vec2 v_texCoord;" +
  "out vec4 v_coord;" +
  "out vec2 v_texCrop;" +
  "out vec2 v_texCropSize;" +
  "out vec4 v_fillColor;" +
  "out vec4 v_tintColor;" +
  "out float v_texId;" +
  "out float v_tintType;" +
  "out float v_colorMultiply;" +
  "out vec4 v_fogColor;";

  if (config.isMaskEnabled) shader += "out float v_maskTexId;";

  if (config.isLightEnabled) {
    shader +=
    "vec4 lightValue(vec4 pos,vec2 lightPosition,vec2 lightVolume,vec4 lightColor,vec4 lightEffect){" +
      "vec2 dist=pos.xy-lightPosition;" +
      "return lightColor*lightColor.a*max(0.0,min(1.0,1.0-sqrt(" +
        "pow(abs(dist.x+(abs(dist.x)*lightEffect.x)),lightEffect.z)*(lightVolume.x/u_resolution.y)+" +
        "pow(abs(dist.y+(abs(dist.y)*lightEffect.y)),lightEffect.w)*(lightVolume.y/u_resolution.x/u_resolution.y)" +
      ")));" +
    "}";
  }

  shader +=
  "void main(void){" +
    "vec3 pos=vec3(a_position,1.0);" +
    "gl_Position=vec4((a_worldMatrix*a_matrix*pos).xy,0.0,1.0);" +
    "v_texCoord=(a_texMatrix*pos).xy;" +
    "v_coord=gl_Position;" +
    "v_texCrop=a_texCrop.xy;" +
    "v_texCropSize=a_texCrop.zw-a_texCrop.xy;" +
    "v_fillColor=a_fillColor;" +
    "v_tintColor=a_tintColor;" +

    "v_texId=a_effects.x;" +
    "v_tintType=a_effects.y;";

    shader +=
    "vec4 lightColor=vec4(0.0);";

    if (config.isLightEnabled) {
      for (var i = 0; i < maxLightSources; i++) {
        shader +=
        "if(u_lightColors[" + i + "].a>0.0 && u_lightZIndices[" + i + "]>a_effects.z){" +
          "lightColor+=lightValue(" +
            "v_coord," +
            "u_lightPositions[" + i + "]," +
            "u_lightVolumes[" + i + "]," +
            "u_lightColors[" + i + "]," +
            "u_lightEffects[" + i + "]" +
          ");" +
        "}";
      }
    }

    shader +=
    "float colorLightMultiply=max(0.0,u_fog.a-lightColor.a);" +
    "v_colorMultiply=max(0.0,1.0-colorLightMultiply);" +
    "v_fogColor=vec4(u_fog.rgb*colorLightMultiply,0.0);" +
    "v_fillColor+=lightColor;";

    if (config.isMaskEnabled) shader += "v_maskTexId=a_effects.w;";

    shader += "}";

  return shader;
});
rof(AGL.Stage2D, "createFragmentShader", function(config) {
  var maxTextureImageUnits = config.textureNum;

  var shader = "#version 300 es\n" +
  "#define MAX_TEXTURES " + maxTextureImageUnits + "\n";

  shader +=
  "precision lowp float;" +

  "in vec4 v_coord;" +
  "in vec2 v_texCoord;" +
  "in vec2 v_texCrop;" +
  "in vec2 v_texCropSize;" +
  "in vec4 v_fillColor;" +
  "in vec4 v_tintColor;" +
  "in float v_texId;" +
  "in float v_tintType;" +
  "in float v_colorMultiply;" +
  "in vec4 v_fogColor;";

  if (config.isMaskEnabled) shader += "in float v_maskTexId;";

  shader +=
  "uniform sampler2D u_tex[MAX_TEXTURES];";

  if (config.isFilterEnabled)
  shader += "uniform int u_filters;";

  shader += "out vec4 fragColor;";

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
        shader += "fragColor=" + (
          i < 0
            ? "vec4(0.0,0.0,0.0,0.0);"
            : "texture(u_tex[" + i + "],v_texCrop+v_texCropSize*fract(v_texCoord));"
          );
      shader +=
        "if(fragColor.a==0.0) discard;" +
      "}";
    }

    shader +=
    "if(fragColor.a>0.0){" +
      "if(v_tintType<0.5) " +
        "fragColor*=v_tintColor;" +
      "else if(v_tintType<1.5 && fragColor.r==fragColor.g && fragColor.r==fragColor.b) " +
        "fragColor*=v_tintColor;" +
      "else if(v_tintType<2.5) " +
        "fragColor=vec4((fragColor.rgb*(1.0-v_tintColor.a))+(v_tintColor.rgb*v_tintColor.a),fragColor.a);";

      shader +=
      "vec4 finalColor=vec4(fragColor.rgb*v_colorMultiply,fragColor.a);" +
      "fragColor=(finalColor*v_fillColor)+v_fogColor;";

      if (config.isFilterEnabled) {
        shader += "if(u_filters>0 && fragColor.a>0.0){";
        for (var i = 0; i < config.filters.length; i++) {
          shader += "if((" + config.filters[i] + " & u_filters)>0){";
            switch (config.filters[i]) {
              case AGL.Stage2D.Filters.GRAYSCALE:
                shader +=
                "fragColor=vec4(" +
                  "vec3(1.0)*((fragColor.r+fragColor.g+fragColor.b)/3.0)," +
                  "fragColor.a" +
                ");";
              break;
              case AGL.Stage2D.Filters.SEPIA:
                shader +=
                "fragColor=vec4(" +
                  "vec3(0.874,0.514,0.156)*((fragColor.r+(fragColor.g+fragColor.b))/3.0)," +
                  "fragColor.a" +
                ");";
              break;
              case AGL.Stage2D.Filters.INVERT:
                shader +=
                "fragColor=abs(vec4(fragColor.rgb-1.0,fragColor.a));";
              break;
              case AGL.Stage2D.Filters.COLORLIMIT:
                shader +=
                "fragColor=vec4(" +
                  "(floor((fragColor.rgb*256.0)/32.0)/256.0)*32.0," +
                  "fragColor.a" +
                ");";
              break;
              case AGL.Stage2D.Filters.VIGNETTE:
                shader +=
                "float vignetteValue=(1.0-sqrt(pow(v_coord.x,4.0)+pow(v_coord.y,4.0)));" +
                "fragColor*=vec4(vec3(vignetteValue),1);";
              break;
              case AGL.Stage2D.Filters.RAINBOW:
                shader +=
                "fragColor+=vec4(v_coord.x*0.15,v_coord.y*0.15,(v_coord.x-v_coord.y)*0.15,0);";
              break;
              case AGL.Stage2D.Filters.LINES:
                shader += "fragColor+=vec4(sin(v_coord.y* 500.0)*0.2);";
              break;
            }
          shader += "}";
        }
        shader += "}";
      }
      if (config.isMaskEnabled) shader += "fragColor.a*=maskAlpha;";

      shader +=
    "}" +
  "}";

  return shader;
});
