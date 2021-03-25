require("../NameSpace.js");
require("./agl.BaseRenderer.js");

AGL.LightRenderer = helpers.createPrototypeClass(
  AGL.BaseRenderer,
  function LightRenderer(options) {
    options                  = options || {};
    options.config           = AGL.Utils.initRendererConfig(options.config, AGL.LightRenderer);
    options.config.locations = options.config.locations.concat([
      "aExt",
      "uHTex",
      "uDHS",
      "uDHL",
      "uAT",
      "uS",
      "uTE"
    ]);

    this.shadowMap = options.shadowMap;
    this.heightMap = options.heightMap;

    this._MAX_BATCH_ITEMS = helpers.isEmpty(options.lightNum)
      ? 1
      : Math.max(1, options.lightNum || 1);

    this.shadowStart = helpers.isEmpty(options.shadowStart)
      ? 0
      : Math.max(0, options.shadowStart);

    this.shadowLength = helpers.isEmpty(options.shadowLength)
      ? 1
      : Math.max(this.shadowStart, Math.min(1, options.shadowLength));

    this.allowTransparency = options.allowTransparency === true;

    this._texturesEnabled = [0, 0];

    AGL.BaseRenderer.call(this, options.config);

    this._extensionBuffer = new AGL.Buffer(
      this._MAX_BATCH_ITEMS,
      "aExt", 1, 4
    );

    this._lights = [];
    for (var i = 0; i < this._MAX_BATCH_ITEMS; ++i)
      this._lights.push(new AGL.Light(i, this._matrixBuffer.data, this._extensionBuffer.data));
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

    _scope.getLight = function(id) {
      return this._lights[id];
    }

    _scope._useShadowTexture = function(texture, locationId, id) {
      if (texture) {
        var textureId = this._context.useTexture(texture, this._renderTime, true);
        this._gl.uniform1i(this._locations[locationId], textureId);
        this._texturesEnabled[id] = 1;
      } else this._texturesEnabled[id] = 0;
    }

    _scope._render = function() {
      var gl        = this._gl;
      var locations = this._locations;

      this._context.setBlendMode(AGL.BlendMode.ADD);

      this._useShadowTexture(this.shadowMap, "uTex",  0);
      this._useShadowTexture(this.heightMap, "uHTex", 1);

      this._uploadBuffers();

      gl.uniform2fv(locations.uTE, this._texturesEnabled);
      gl.uniform1f(locations.uDHS, this._shadowStart);
      gl.uniform1f(locations.uDHL, this._shadowLength);
      gl.uniform1f(locations.uAT,  this._allowTransparency);

      this._drawInstanced(this._lights.length);
    }

    _scope._resize = function() {
      var isResized = _super._resize.call(this);

      isResized && this._gl.uniform4f(this._locations.uS, this._width, this._height, 1 / this._width, 1 / this._height);

      return isResized;
    }

    _scope._uploadBuffers = function() {
      this._extensionBuffer.upload(this._gl, this._enableBuffers, this._locations);
      _super._uploadBuffers.call(this);
    }

    _scope._createBuffers = function() {
      _super._createBuffers.call(this);
      this._extensionBuffer.create(this._gl);
    }

    _scope._createVertexShader = function(config) {
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
      "out float vD;" +
      "out float vSpt;" +

      "void main(void){" +
        "vec3 pos=vec3(aPos*2.-1.,1);" +
        "vExt=aExt;" +
        "vCol=aMt[2];" +
        "vDat=aMt[3];" +
        "vCrd.xy=pos.xy;" +
        "vS=uS;" +
        "vHS=vExt.z/1024.;" +
        "mat3 mt;" +
        "if(vExt.x<1.){" +
          "mt=mat3(aMt[0].xy,0,aMt[0].zw,0,aMt[1].xy,1);" +
          "gl_Position=vec4(mt*pos,1);" +
          "vTCrd=(gl_Position.xy+H.xy)/H.zw;" +
          "vCrd.zw=(aMt[1].xy+H.xy)/H.zw;" +
          "vD=aMt[1].z;" +
          "vSpt=aMt[1].w;" +
        "}else{" +
          "mt=mat3(aMt[0].xy,0,aMt[0].zw,0,-1,1,1);" +
          "gl_Position=vec4(pos,1);" +
          "vTCrd=vec2(aPos.x,1.-aPos.y);" +
          "vCrd.zw=vTCrd+((mt*vec3(1,1,1)).xy+H.xy)/H.zw;" +
        "}" +
        "gl_Position.y*=uFlpY;" +
      "}";
    };

    _scope._createFragmentShader = function(config) {
      var calcDistance = "if(isl){" +
        "dst=length(vec3(vCrd.xy,((vHS-ph)*1024.)/vD));" +
        "if(" +
          "dst>1.||" +
          "(vSpt<PI&&atan(vHS-ph,length(vCrd.xy))+PIH<PI-vSpt)" +
        ")discard;" +
        "if(vDat.w<PI&&atan(vCrd.x,length(vec2(vHS-ph,vCrd.y)))+PIH<PI-vDat.w)dst*=1.5;" +
      "}";

      var calcCoord = "vec2 p=vTCrd-i*m;";

      var calcHeight = "float pc=(i/dstTex)*mh;";

      var heightCheck = "tc=texture(uHTex,p);" +
      "if(tc.b>0.){" +
        "tc.rg-=ph;";

      var transparencyCheck =
      "tc=texture(uTex,p);" +
      "if(c.a<tc.a){" +
        "c.a+=tc.a;" +
        "if(c.a>=1.)discard;" +
      "}" +
      "c.rgb+=rgb*tc.rgb*tc.a;";

      function createLoop(core) {
        return "float st=vExt.w;" +
        "float l=dstTex-st;" +
        "float umb=vDat.y;" +
        "float lst=max(1.,dstTex/128.);" +
        "for(float i=st;i<l;i+=lst){" +
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
          calcDistance +
          loopA +
        "}else{" +
          loopB +
        "}";
      }

      return AGL.Utils.createVersion(config.precision) +
      "#define PI radians(180.)\n" +
      "#define PIH radians(90.)\n" +

      "in vec2 vTCrd;" +
      "in vec4 vCrd;" +
      "in vec4 vCol;" +
      "in vec4 vDat;" +
      "in vec4 vExt;" +
      "in vec4 vS;" +
      "in float vHS;" +
      "in float vD;" +
      "in float vSpt;" +

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
        "float dst=0.;" +

        "if(isl&&vDat.w<PI&&abs(atan(vCrd.y,vCrd.x))>vDat.w)discard;" +

        "vec3 rgb=vCol.rgb;" +
        "if(vExt.y<1.||(uTE.x<1.&&uTE.y<1.))dst=length(vCrd.xy);" +
        "else{" +
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
            calcDistance +
            "if(uAT>0.&&uTE.x>0.){" +
              createLoop(
                calcCoord +
                heightCheck +
                  calcHeight +
                  "if(tc.x<=pc&&tc.y>=pc){" +
                    transparencyCheck +
                  "}" +
                "}"
              ) +
            "}else{" +
              createLoop(
                calcCoord +
                heightCheck +
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
        "fgCol=vec4(rgb*(1.-dst)*vDat.z,1);" +
      "}";
    };
  }
);
