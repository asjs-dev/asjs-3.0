require("../NameSpace.js");
require("./agl.BaseRenderer.js");

AGL.LightRenderer = helpers.createPrototypeClass(
  AGL.BaseRenderer,
  function LightRenderer(options) {
    options = options || {};

    var config = AGL.Utils.initConfig({
      canvas : options.canvas,
      isOffscreen : true,
      locations : [
        "aMt",
        "aExt",
        "uHTex",
        "uDHS",
        "uDHL",
        "uAT",
        "uS",
        "uTE"
      ]
    }, AGL.LightRenderer);

    config.lightNum = Math.max(0, options.lightNum || 1);

    AGL.BaseRenderer.call(this, config);

    this.shadowMap = options.shadowMap;
    this.heightMap = options.heightMap;

    this.shadowStart       = helpers.isEmpty(options.shadowStart)  ? 0 : options.shadowStart;
    this.shadowLength      = helpers.isEmpty(options.shadowLength) ? 1 : options.shadowLength;
    this.allowTransparency = options.allowTransparency === true;
  },
  function(_scope, _super) {
    helpers.property(_scope, "shadowStart", {
      get: function() { return this._shadowStart; },
      set: function(v) { this._shadowStart = Math.max(0, Math.min(1, v || 0)); }
    });

    helpers.property(_scope, "shadowLength", {
      get: function() { return this._shadowLength; },
      set: function(v) { this._shadowLength = Math.max(0, Math.min(1, v || 1)); }
    });

    helpers.property(_scope, "allowTransparency", {
      get: function() { return this._allowTransparency; },
      set: function(v) { this._allowTransparency = v ? 1 : 0; }
    });

    _scope._useShadowTexture = function(texture, locationId, id, textureId) {
      if (texture) {
        this._gl.uniform1i(this._locations[locationId], ++textureId);
        texture.isNeedToDraw(this._gl, this._renderTime) && texture.useTexture(textureId);
        this._texturesEnabled[id] = 1;
      } else this._texturesEnabled[id] = 0;
      return textureId;
    }

    _scope._render = function() {
      var textureId = -1;
      textureId = this._useShadowTexture(this.shadowMap, "uTex",  0, textureId);
      textureId = this._useShadowTexture(this.heightMap, "uHTex", 1, textureId);

      this._gl.uniform2fv(this._locations.uTE, this._texturesEnabled);

      this._gl.uniform1f(this._locations.uDHS, this._shadowStart);
      this._gl.uniform1f(this._locations.uDHL, this._shadowLength);
      this._gl.uniform1f(this._locations.uAT, this._allowTransparency);

      this._bindArrayBuffer(this._lightBuffer,     this._lightData);
      this._bindArrayBuffer(this._extensionBuffer, this._extensionData);

      this._gl.clearColor(0, 0, 0, 1);
      this._gl.clear({{AGL.Const.COLOR_BUFFER_BIT}});
      this._useBlendMode(AGL.BlendMode.ADD);
      this._gl.drawElementsInstanced({{AGL.Const.TRIANGLE_FAN}}, 6, {{AGL.Const.UNSIGNED_SHORT}}, 0, this._lights.length);

      this._gl.flush();
    }

    _scope.getLight = function(id) {
      return this._lights[id];
    }

    _scope._resize = function() {
      _super._resize.call(this);

      this._gl.uniform4f(this._locations.uS, this._width, this._height, 1 / this._width, 1 / this._height);
    }

    _scope._initCustom = function() {
      this._gl.bindBuffer({{AGL.Const.ELEMENT_ARRAY_BUFFER}}, this._gl.createBuffer());
      this._gl.bufferData(
        {{AGL.Const.ELEMENT_ARRAY_BUFFER}},
        AGL.Utils.pointsOrder,
        {{AGL.Const.STATIC_DRAW}}
      );

      this._texturesEnabled = [0, 0];

      var lightNum = this._config.lightNum;

      this._lightData       = new F32A(lightNum * 16);
      this._lightBuffer     = this._createArrayBuffer(this._lightData,     "aMt",  16, 4, 4, {{AGL.Const.FLOAT}}, 4);
      this._extensionData   = new F32A(lightNum * 4);
      this._extensionBuffer = this._createArrayBuffer(this._extensionData, "aExt",  4, 1, 4, {{AGL.Const.FLOAT}}, 4);

      this._lights = [];

      for (var i = 0; i < lightNum; ++i)
      this._lights.push(new AGL.Light(i, this._lightData, this._extensionData));
    }
  }
);
AGL.LightRenderer.createVertexShader = function(config) {
  return AGL.Utils.createVersion(config.precision) +
  "#define H vec4(1,-1,2,-2)\n" +

  "in vec2 aPos;" +
  "in mat4 aMt;" +
  "in vec4 aExt;" +

  "uniform vec4 uS;" +
  "uniform float uFlpY;" +

  "out vec2 vTCrd;" +
  "out vec4 vCrd;" +
  "out vec4 vCol;" +
  "out vec4 vDat;" +
  "out vec4 vExt;" +
  "out mat4 vQ;" +
  "out vec4 vS;" +
  "out float vHS;" +

  "void main(void){" +
    "vec3 pos=vec3(aPos*2.-1.,1);" +
    "vExt=aExt;" +
    "vCol=aMt[2];" +
    "vDat=aMt[3];" +
    "vCrd.xy=pos.xy;" +
    "vS=uS;" +
    "vHS=clamp(.01,1.,vExt.z/1024.);" +
    "if(vExt.x<1.){" +
      "mat3 mt=mat3(aMt[0].xy,0,aMt[0].zw,0,aMt[1].xy,1);" +
      "gl_Position=vec4(mt*pos,1);" +
      "vTCrd=(gl_Position.xy+H.xy)/H.zw;" +
      "vCrd.zw=((mt*vec3(0,0,1)).xy+H.xy)/H.zw;" +
    "}else{" +
      "mat3 mt=mat3(aMt[0].xy,0,aMt[0].zw,0,-1,1,1);" +
      "gl_Position=vec4(pos,1);" +
      "vTCrd=(gl_Position.xy+H.xy)/H.zw;" +
      "vCrd.zw=vTCrd+((mt*vec3(1,1,1)).xy+H.xy)/H.zw;" +
    "}" +
    "gl_Position.y*=uFlpY;" +
  "}";
};
AGL.LightRenderer.createFragmentShader = function(config) {
  var calcCoord = "vec2 p=vTCrd-i*m;";

  var calcHeight = "float pc=(i/dstTex)*mh;";

  var transparencyCheck =
  "tc=texture(uTex,p);" +
  "if(c.a<tc.a){" +
    "c.a+=tc.a;" +
    "if(c.a>=1.)discard;" +
  "}" +
  "c.rgb+=rgb*tc.rgb*tc.a;";

  function createLoop(core) {
    return "float st=vExt.w;" +
    "float l=dstTex-vExt.w;" +
    "float umb=vDat.y;" +
    "for(float i=st;i<l;++i){" +
      core +
      "i+=st+(i/dstTex)*umb;" +
    "}";
  }

  function createShadowMapBlock(loopA, loopB) {
    return "if(sl.y-sl.x<1.){" +
      "if(texture(uTex,vTCrd).a>0.){" +
        "ph=sl.y;" +
        "mh-=ph;" +
        "sl-=ph;" +
      "}" +
      "dst=isl?distance(vec3(0,0,vHS),vec3(vCrd.xy,ph)):distance(vec3(vTCrd,vHS),vec3(vCrd.zw,ph));" +
      loopA +
    "}else{" +
      loopB +
    "}";
  }

  return AGL.Utils.createVersion(config.precision) +
  "#define PI radians(180.)\n" +

  "in vec2 vTCrd;" +
  "in vec4 vCrd;" +
  "in vec4 vCol;" +
  "in vec4 vDat;" +
  "in vec4 vExt;" +
  "in vec4 vS;" +
  "in float vHS;" +

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
    "float dst=1.;" +
    "if(isl){" +
      "dst=length(vCrd.xy);" +
      "if(dst>1.||atan(vCrd.y,vCrd.x)+PI>vDat.w)discard;" +
    "}" +
    "vec3 rgb=vCol.rgb;" +
    "if(vExt.y>0.&&(uTE.x>0.||uTE.y>0.)){" +
      "vec2 tCrd=vTCrd*vS.xy;" +
      "vec2 tCnt=vCrd.zw*vS.xy;" +

      "vec2 dsth=tCrd-tCnt;" +
      "float dstTex=distance(tCrd,tCnt);" +
      "vec2 m=(dsth/dstTex)*vS.zw;" +

      "vec4 c=vec4(0);" +
      "vec4 tc;" +

      "float mh=vHS;" +
      "float ph=0.;" +
      "if(uTE.y>0.){" +
        "tc=texture(uHTex,vTCrd);" +
        "ph=tc.b>0.?tc.g:0.;" +
        "mh-=ph;" +
        "dst=isl?distance(vec3(0,0,vHS),vec3(vCrd.xy,ph)):distance(vec3(vTCrd,vHS),vec3(vCrd.zw,ph));" +
        "if(uAT>0.&&uTE.x>0.){" +
          createLoop(
            calcCoord +
            "tc=texture(uHTex,p);" +
            "if(tc.b>0.){" +
              "tc.rg-=ph;" +
              calcHeight +
              "if(tc.x<=pc&&tc.y>=pc){" +
                transparencyCheck +
              "}" +
            "}"
          ) +
        "}else{" +
          createLoop(
            calcCoord +
            "tc=texture(uHTex,p);" +
            "if(tc.b>0.){" +
              "tc.rg-=ph;" +
              calcHeight +
              "if(tc.x<=pc&&tc.y>=pc)discard;" +
            "}"
          ) +
        "}" +
      "}else{" +
        "vec2 sl=vec2(uDHS,uDHL);" +
        "if(uAT>0.){" +
          createShadowMapBlock(
            createLoop(
              calcHeight +
              "if(sl.x<=pc&&sl.y>=pc){" +
                calcCoord +
                transparencyCheck +
              "}"
            ), createLoop(
              calcCoord +
              transparencyCheck
            )
          ) +
        "}else{" +
          createShadowMapBlock(
            createLoop(
              calcCoord +
              "if(texture(uTex,p).a>0.){" +
                calcHeight +
                "if(sl.x<=pc&&sl.y>=pc)discard;" +
              "}"
            ), createLoop(
              calcCoord +
              "if(texture(uTex,p).a>0.)discard;"
            )
          ) +
        "}" +
      "}" +
      "rgb=rgb*(1.-c.a)+c.rgb;" +
    "}" +
    "float mp=clamp(1.-dst,0.,100.);" +
    "fgCol=vec4(rgb*mp*vDat.z,1);" +
  "}";
};
