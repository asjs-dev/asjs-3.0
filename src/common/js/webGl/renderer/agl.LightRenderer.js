require("../NameSpace.js");
require("./agl.RendererHelper.js");

AGL.LightRenderer = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function LightRenderer(options) {
    options = options || {};

    helpers.BasePrototypeClass.call(this);

    var config = AGL.RendererHelper.initConfig({
      contextAttributes : {
        alpha              : true,
        premultipliedAlpha : false
      },
      locations : [
        "aMt",
        "aExt",
        "uHTex",
        "uDHS",
        "uDHL",
        "uAT",
        "uS",
        "uP",
        "uTE"
      ]
    }, AGL.LightRenderer);

    config.lightNum = Math.max(0, options.lightNum || 1);

    AGL.RendererHelper.constructor.call(this, config);

    this.shadowMap = options.shadowMap;
    this.heightMap = options.heightMap;

    this.shadowStart       = helpers.isEmpty(options.shadowStart)  ? 0 : options.shadowStart;
    this.shadowLength      = helpers.isEmpty(options.shadowLength) ? 1 : options.shadowLength;
    this.precision         = helpers.isEmpty(options.precision)    ? 1 : options.precision;
    this.allowTransparency = options.allowTransparency === true;
  },
  function(_scope, _super) {
    AGL.RendererHelper.body.call(_scope, _scope);

    helpers.get(_scope, "stage",  function() { return this; });

    helpers.property(_scope, "shadowStart", {
      get: function() { return this._shadowStart; },
      set: function(v) {
        v = Math.max(0, Math.min(1, v || 0));
        if (this._shadowStart !== v) {
          this._shadowStart = v;
          this._gl.uniform1f(this._locations.uDHS, v);
        }
      }
    });

    helpers.property(_scope, "shadowLength", {
      get: function() { return this._shadowLength; },
      set: function(v) {
        v = Math.max(0, Math.min(1, v || 1));
        if (this._shadowLength !== v) {
          this._shadowLength = v;
          this._gl.uniform1f(this._locations.uDHL, v);
        }
      }
    });

    helpers.property(_scope, "allowTransparency", {
      get: function() { return this._allowTransparency; },
      set: function(v) {
        if (this._allowTransparency !== v) {
          this._allowTransparency = v;
          this._gl.uniform1f(this._locations.uAT, v ? 1 : 0);
        }
      }
    });

    helpers.property(_scope, "precision", {
      get: function() { return this._precision; },
      set: function(v) {
        v = Math.max(1, Math.min(10, v));
        if (this._precision !== v) {
          this._precision = v;
          this._gl.uniform1f(this._locations.uP, 1810 / v);
        }
      }
    });

    _scope._useShadowTexture = function(texture, id) {
      texture.isNeedToDraw(this._gl, this._renderTime) && AGL.Utils.useActiveTexture(this._gl, texture, id);
      this._texturesEnabled[id] = 1;
    }

    _scope._render = function() {
      if (this.shadowMap) {
        this._useShadowTexture(this.shadowMap, 0);

        this.heightMap
          ? this._useShadowTexture(this.heightMap, 1)
          : this._texturesEnabled[1] = 0;

      } else this._texturesEnabled[0] = this._texturesEnabled[1] = 0;

      this._gl.uniform2fv(this._locations.uTE, this._texturesEnabled);

      this._bindArrayBuffer(this._lightBuffer,     this._lightData);
      this._bindArrayBuffer(this._extensionBuffer, this._extensionData);

      this._gl.clear({{AGL.Const.COLOR_BUFFER_BIT}});
      this._gl.drawElementsInstanced({{AGL.Const.TRIANGLE_FAN}}, 6, {{AGL.Const.UNSIGNED_SHORT}}, 0, this._lights.length);

      this._gl.flush();
    }

    _scope.destruct = function() {
      this._destructRenderer();

      _super.destruct.call(this);
    }

    _scope.getLight = function(id) {
      return this._lights[id];
    }

    var _superResize = _scope._resize;
    _scope._resize = function() {
      _superResize.call(this);

      this._gl.uniform4f(this._locations.uS, this._width, this._height, 1 / this._width, 1 / this._height);
    }

    _scope._initCustom = function() {
      this._gl.bindBuffer({{AGL.Const.ELEMENT_ARRAY_BUFFER}}, this._gl.createBuffer());
      this._gl.bufferData(
        {{AGL.Const.ELEMENT_ARRAY_BUFFER}},
        AGL.RendererHelper.pointsOrder,
        {{AGL.Const.STATIC_DRAW}}
      );

      this._gl.uniform1i(this._locations.uTex,  0);
      this._gl.uniform1i(this._locations.uHTex, 1);

      this._texturesEnabled = [0, 0];

      var lightNum = this._config.lightNum;

      this._lightData       = new F32A(lightNum * 16);
      this._lightBuffer     = this._createArrayBuffer(this._lightData,     "aMt",  16, 4, 4, {{AGL.Const.FLOAT}}, 4);
      this._extensionData   = new F32A(lightNum * 4);
      this._extensionBuffer = this._createArrayBuffer(this._extensionData, "aExt",  4, 1, 4, {{AGL.Const.FLOAT}}, 4);

      this._lights = [];

      for (var i = 0; i < lightNum; ++i)
      this._lights.push(new AGL.Light(i, this._lightData, this._extensionData));

      this._gl.clearColor(0, 0, 0, 1);
      this._useBlendMode(AGL.BlendMode.ADD);
    }
  }
);
AGL.LightRenderer.createVertexShader = function(config) {
  return AGL.RendererHelper.createVersion(config.precision) +
  "#define PI radians(180.)\n" +

  "in vec2 aPos;" +
  "in mat4 aMt;" +
  "in vec4 aExt;" +

  "uniform vec4 uS;" +
  "uniform float uP;" +

  "out vec2 vTCrd;" +
  "out vec4 vCrd;" +
  "out vec4 vCol;" +
  "out vec4 vDat;" +
  "out vec4 vExt;" +
  "out mat4 vQ;" +
  "out vec4 vS;" +
  "out float vRS;" +

  "void main(void){" +
    "vec3 pos=vec3(aPos*2.-1.,1);" +
    "vec4 h=vec4(1,-1,2,-2);" +
    "vExt=aExt;" +
    "vCol=aMt[2];" +
    "vDat=aMt[3];" +
    "vCrd.xy=pos.xy;" +
    "vS=uS;" +
    "vRS=max(1.,distance(vec2(0),vS.xy)/uP);" +
    "if(vExt.x<1.){" +
      "mat3 mt=mat3(aMt[0].xy,0,aMt[0].zw,0,aMt[1].xy,1);" +
      "gl_Position=vec4(mt*pos,1);" +
      "vTCrd=(gl_Position.xy+h.xy)/h.zw;" +
      "vCrd.zw=((mt*vec3(0,0,1)).xy+h.xy)/h.zw;" +
    "}else{" +
      "gl_Position=vec4(pos,1);" +
      "vTCrd=(gl_Position.xy+h.xy)/h.zw;" +
      "vec2 sc=vec2(sin(vDat.w),cos(vDat.w));" +
      "vCrd.zw=vTCrd+vec2(aMt[0].x*sc.y,aMt[0].x*sc.x);" +
    "}" +
  "}";
};
AGL.LightRenderer.createFragmentShader = function(config) {
  function coreWrapper(core, pos, bo) {
    return
    "tc=texture(uTex," + pos + ");" +
    "if(tc.a>0.){" +
      core +
    "}" +
    (bo
      ? "else{" +
          "i+=vRS;" +
          "continue;" +
        "}"
      : ""
    );
  }

  function createHeightMapCheck(core) {
    return
    "float pc=i*hs;" +
    "if(sl.x<pc&&sl.y>pc){" +
      core +
    "}";
  }

  function createLoop(core) {
    return
    "for(float i=3.;i<dstTex-1.;i+=vRS){" +
      "vec2 p=vTCrd-i*m;" +
      coreWrapper(core, "p", true) +
    "}";
  }

  function createLoops(core) {
    return
    "vec4 tc;" +
    "if(uTE.y>0.){" +
      createLoop(
        "vec4 shc=texture(uHTex,p);" +
        "sl=shc.b>0.?shc.rg:udh;" +
        createHeightMapCheck(core)
      ) +
    "}else{" +
      "if(uDHS>0.||uDHL<1.){" +
        createLoop(createHeightMapCheck(core)) +
      "}else{" +
        createLoop(core) +
      "}" +
    "}" +
    coreWrapper(core, "vTCrd");
  }

  return AGL.RendererHelper.createVersion(config.precision) +
  "#define PI radians(180.)\n" +

  "in vec2 vTCrd;" +
  "in vec4 vCrd;" +
  "in vec4 vCol;" +
  "in vec4 vDat;" +
  "in vec4 vExt;" +
  "in vec4 vS;" +
  "in float vRS;" +

  "uniform sampler2D uTex;" +
  "uniform sampler2D uHTex;" +

  "uniform float uDHS;" +
  "uniform float uDHL;" +
  "uniform float uAT;" +
  "uniform vec2 uTE;" +

  "out vec4 fgCol;" +

  "void main(void){" +
    "if(vDat.x==0.)discard;" +
    "bool isl=vExt.x<1.;" +
    "float dst;" +
    "if(isl){" +
      "dst=distance(vec2(0),vCrd.xy);" +
      "if(dst>1.||atan(vCrd.y,vCrd.x)+PI>vDat.w)discard;" +
    "}" +
    "vec3 rgb=vCol.rgb;" +
    "if(vExt.y==1.&&uTE.x>0.){" +
      "vec2 tCrd=vTCrd*vS.xy;" +
      "vec2 tCnt=vCrd.zw*vS.xy;" +

      "vec2 dsth=tCrd-tCnt;" +
      "vec2 adsth=abs(dsth);" +
      "float dstTex=max(adsth.x,adsth.y);" +
      "vec2 m=(dsth/dstTex)*vS.zw;" +
      "float hs=max(.001,vExt.z)/dstTex;" +

      "vec2 udh=vec2(uDHS,uDHL);" +
      "vec2 sl=udh;" +
      "vec4 c=vec4(0);" +
      "if(uAT==1.){" +
        createLoops(
          "c.a+=c.a<tc.a?tc.a:0.;" +
          "if(c.a>=1.)discard;" +
          "c.rgb+=rgb*tc.rgb*tc.a;"
        ) +
      "}else{" +
        createLoops("discard;") +
      "}" +
      "rgb=rgb*(1.-c.a)+c.rgb;" +
    "}" +
    "float mp=isl?clamp((1.-dst)*vDat.y,0.,1.):1.;" +
    "fgCol=vec4(rgb*mp*vDat.z,1);" +
  "}";
};
