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
        "uHTex",
        "uDHS",
        "uDHL",
        "uP",
        "uAT"
      ]
    }, AGL.LightRenderer);

    options.lightNum = Math.max(0, options.lightNum || 1);

    this.shadowMap = options.shadowMap;
    this.heightMap = options.heightMap;

    this._lightData = new Float32Array(options.lightNum * 16);

    this._lights = [];

    var l = options.lightNum;
    for (var i = 0; i < l; ++i) this._lights.push(new AGL.Light(i, this._lightData));

    AGL.RendererHelper.initRenderer.call(this, config);

    this.shadowStart       = helpers.isEmpty(options.shadowStart)  ? 0 : options.shadowStart;
    this.shadowLength      = helpers.isEmpty(options.shadowLength) ? 1 : options.shadowLength;
    this.precision         = helpers.isEmpty(options.precision)    ? 1 : options.precision;
    this.allowTransparency = options.allowTransparency === true;
  },
  function(_scope, _super) {
    AGL.RendererHelper.createRendererBody.call(_scope, _scope);

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

    helpers.property(_scope, "precision", {
      get: function() { return this._precision; },
      set: function(v) {
        v = Math.max(1, Math.min(5, v));
        if (this._precision !== v) {
          this._precision = v;
          this._gl.uniform1f(this._locations.uP, v);
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

    _scope._render = function() {
      this._gl.clear({{AGL.Const.COLOR_BUFFER_BIT}});

      this.shadowMap && this.shadowMap.isNeedToDraw(this._gl, this._renderTime) &&
        AGL.Utils.useTexture(this._gl, 0, this.shadowMap);

      this.heightMap && this.heightMap.isNeedToDraw(this._gl, this._renderTime) &&
        AGL.Utils.useTexture(this._gl, 1, this.heightMap);

      this._bindArrayBuffer(this._lightBuffer, this._lightData);
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

    _scope._initCustom = function() {
      this._gl.bindBuffer({{AGL.Const.ELEMENT_ARRAY_BUFFER}}, this._gl.createBuffer());
      this._gl.bufferData(
        {{AGL.Const.ELEMENT_ARRAY_BUFFER}},
        new Uint16Array([
          0, 1, 2,
          0, 2, 3
        ]),
        {{AGL.Const.STATIC_DRAW}}
      );

      this._gl.uniform1i(this._locations.uTex,  0);
      this._gl.uniform1i(this._locations.uHTex, 1);

  		this._lightBuffer = this._createArrayBuffer(this._lightData, "aMt", 16, 4, 4, {{AGL.Const.FLOAT}}, 4);

      this._useBlendMode(AGL.BlendMode.ADD);

      this._gl.clearColor(0, 0, 0, 1);
    }
  }
);
AGL.LightRenderer.createVertexShader = function(config) {
  return AGL.RendererHelper.createVersion(config.precision) +

  "in vec2 aPos;" +
  "in mat4 aMt;" +

  "out vec2 vTCrd;" +
  "out vec4 vCrd;" +
  "out vec4 vCol;" +
  "out vec4 vDat;" +
  "out vec2 vExt;" +
  "out mat4 vQ;" +

  "void main(void){" +
    "vec4 h=vec4(1,-1,2,-2);" +
    "mat3 mt=mat3(aMt[0].xy,0,aMt[0].zw,0,aMt[1].xy,1);" +
    "vec3 pos=vec3(aPos*2.-1.,1);" +
    "gl_Position=vec4(mt*pos,1);" +
    "vTCrd=(gl_Position.xy+h.xy)/h.zw;" +
    "vCrd.xy=pos.xy;" +
    "vCrd.zw=((mt*vec3(0,0,1)).xy+h.xy)/h.zw;" +
    "vExt=aMt[1].zw;" +
    "vCol=aMt[2];" +
    "vDat=aMt[3];" +
  "}";
};
AGL.LightRenderer.createFragmentShader = function(config) {
  function coreWrapper(core, pos) {
    return
    "tc=texture(uTex," + pos + ");" +
    "if(tc.a>0.){" +
      core +
    "}";
  }

  function createHeightMapCheck(core) {
    return
    "float pc=1.-(i/dstTex);" +
    "if(sl.x<pc&&sl.y>pc){" +
      core +
      "if(c.a>=1.)i+=sl.y*dstTex;" +
    "}";
  }

  function createLoop(core) {
    return
    "float x=uP;" +
    "for(float i=uP;i<dstTex-uP;i+=x){" +
      "vec2 p=vCrd.zw+i*m;" +
      "x+=.025;" +
      coreWrapper(core, "p") +
    "}";
  }

  function createLoops(core) {
    return
    "vec4 tc;" +
    "if(pxph.x<1.&&pxph.y<1.){" +
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
  "#define THETA PI/180.\n" +

  "in vec2 vTCrd;" +
  "in vec4 vCrd;" +
  "in vec4 vCol;" +
  "in vec4 vDat;" +
  "in vec2 vExt;" +

  "uniform sampler2D uTex;" +
  "uniform sampler2D uHTex;" +

  "uniform float uDHS;" +
  "uniform float uDHL;" +
  "uniform float uP;" +
  "uniform float uAT;" +

  "out vec4 fgCol;" +

  "void main(void){" +
    "float dst=distance(vec2(0),vCrd.xy);" +
    "if(vDat.x==0.||dst>1.||(((atan(vCrd.y,vCrd.x)/PI)+1.)/2.)*360.>vDat.w)discard;" +
    "vec2 ts=vec2(textureSize(uTex,0));" +
    "vec2 pxp=1./ts;" +
    "vec3 rgb=vCol.rgb;" +
    "if(vExt.x==1.&&pxp.x<1.&&pxp.y<1.){" +
      "vec2 tCrd=vTCrd*ts;" +
      "vec2 tCnt=vCrd.zw*ts;" +
      "float dstTex=distance(tCnt,tCrd);" +
      "if(dstTex>uP){" +
        "vec2 pxph=1./vec2(textureSize(uHTex,0));" +
        "vec2 m=((tCrd-tCnt)/dstTex)*pxp;" +
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
    "}" +
    "fgCol=vec4(rgb*clamp((1.-dst)*vDat.y,0.,1.)*vDat.z,1);" +
  "}";
};
