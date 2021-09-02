require("../NameSpace.js");
require("./agl.BatchRenderer.js");

AGL.LightRenderer = helpers.createPrototypeClass(
  AGL.BatchRenderer,
  function LightRenderer(options) {
    options                  = options || {};
    options.config           = AGL.Utils.initRendererConfig(options.config, AGL.LightRenderer);
    options.config.locations = options.config.locations.concat([
      "aExt",
      "uS",
      "uSC"
    ]);

    this.heightMap = options.heightMap;

    this._MAX_BATCH_ITEMS = max(1, options.lightNum || 1);

    AGL.BatchRenderer.call(this, options);

    this.scale = options.scale;

    this._extensionBuffer = new AGL.Buffer(
      "aExt", this._MAX_BATCH_ITEMS,
      1, 4
    );

    this._lights = [];
    for (var i = 0; i < this._MAX_BATCH_ITEMS; ++i)
      this._lights.push(new AGL.Light(i, this._matrixBuffer.data, this._extensionBuffer.data));
  },
  function(_scope, _super) {
    helpers.property(_scope, "scale", {
      get: function() { return this._scale; },
      set: function(v) {
        v = max(0, min(1, v || 1));
        this._scale = v;
      }
    });

    _scope.getLight = function(id) {
      return this._lights[id];
    }

    _scope._render = function() {
      var gl        = this._gl;
      var locations = this._locations;

      this._context.setBlendMode(AGL.BlendMode.ADD);

      this.heightMap && gl.uniform1i(locations.uTex, this._context.useTexture(this.heightMap, this._renderTime, true));

      this._uploadBuffers();

      gl.uniform1f(locations.uSC, this._scale);

      this._drawInstanced(this._lights.length);
    }

    _scope._customResize = function() {
      this._gl.uniform4f(this._locations.uS, this._width, this._height, 1 / this._width, 1 / this._height);
    }

    _scope._uploadBuffers = function() {
      this._extensionBuffer.upload(this._gl, this._enableBuffers, this._locations);
      _super._uploadBuffers.call(this);
    }

    _scope._createBuffers = function() {
      _super._createBuffers.call(this);
      this._extensionBuffer.create(this._gl);
    }

    _scope._createVertexShader = function(options) {
      return AGL.Utils.createVersion(options.config.precision) +
      "#define H vec4(1,-1,2,-2)\n" +
      "#define PI radians(180.)\n" +

      "in vec2 aPos;" +
      "in mat4 aMt;" +
      "in vec4 aExt;" +

      "uniform vec4 uS;" +
      "uniform float uFlpY;" +
      "uniform float uSC;" +

      "out vec2 vTCrd;" +
      "out vec4 vCrd;" +
      "out vec4 vCl;" +
      "out vec4 vDt;" +
      "out vec4 vExt;" +
      "out vec4 vS;" +
      "out float vHS;" +
      "out float vD;" +
      "out float vSpt;" +
      "out float vSC;" +
      "out vec2 vSln;" +

      "void main(void){" +
        "vExt=aExt;" +
        "vCl=aMt[2];" +
        "vDt=aMt[3];" +

        "vS=uS;" +
        "vSC=uSC;" +
        "vec3 pos=vec3(aPos*2.-1.,1);" +

        "vCrd.xy=pos.xy*vSC;" +
        "vHS=vExt.z*vSC;" +

        "mat3 mt=mat3(aMt[0].xy,0,aMt[0].zw,0,aMt[1].xy,1);" +
        "vExt.w*=vSC;" +
        "vDt.y*=vSC;" +
        "vD=aMt[1].z*vSC;" +
        "if(vExt.x<1.){" +
          "gl_Position=vec4(mt*pos,1);" +
          "vTCrd=(gl_Position.xy+H.xy)/H.zw;" +
          "vCrd.zw=(aMt[1].xy+H.xy)/H.zw;" +
          "vSpt=PI-aMt[1].w;" +
          "vSln=vec2(sin(vDt.w),cos(vDt.w));" +
        "}else{" +
          "mt[2].xy=vec2(-1,1);" +
          "gl_Position=vec4(pos,1);" +
          "vTCrd=vec2(aPos.x,1.-aPos.y);" +
          "vCrd.zw=vTCrd+((mt*vec3(1)).xy+H.xy)/H.zw;" +
        "}" +
        "gl_Position.y*=uFlpY;" +
        "vSC*=255.;" +
      "}";
    };

    _scope._createFragmentShader = function(options) {
      return AGL.Utils.createVersion(options.config.precision) +
      "#define PI radians(180.)\n" +
      "#define PIH radians(90.)\n" +

      "in vec2 vTCrd;" +
      "in vec4 vCrd;" +
      "in vec4 vCl;" +
      "in vec4 vDt;" +
      "in vec4 vExt;" +
      "in vec4 vS;" +
      "in float vHS;" +
      "in float vD;" +
      "in float vSpt;" +
      "in float vSC;" +
      "in vec2 vSln;" +

      "uniform sampler2D uTex;" +

      "out vec4 oCl;" +

      "float clcAng(vec2 a,vec2 b){" +
        "float c=PIH-atan(a.y,a.x);" +
        "float d=atan(b.y,b.x);" +
        "float e=c-PIH;" +
        "float f=e+(e-d);" +
        "return abs(f-PIH)/PIH;" +
      "}" +

      "void main(void){" +
        "if(vDt.x<1.)discard;" +

        "bool isl=vExt.x<1.;" +

        "vec4 tc=texture(uTex,vTCrd);" +

        "float alp=tc.a;" +
        "float shn=tc.b*10.;" +
        "float ph=tc.g*vSC;" +

        "vec2 tCrd=vTCrd*vS.xy;" +
        "vec2 tCnt=vCrd.zw*vS.xy;" +
        "float pxDst=distance(vec3(tCnt,vHS),vec3(tCrd,ph));" +

        "float dst=pxDst/vD;" +

        "if(isl&&dst>1.)discard;" +

        "float shl=vD/vDt.y;" +

        "if(isl&&vSpt>0.&&vSpt<PI){" +
          "float slh=(vHS-ph)/255.;" +
          "vec2 sl=vec2(slh*vSln.y-vCrd.x*vSln.x,slh*vSln.x+vCrd.x*vSln.y);" +
          "if(atan(sl.x,length(vec2(sl.y,vCrd.y)))+PIH<vSpt)discard;" +
        "}" +

        "float vol=1.-(isl?dst:0.);" +

        "int flg=int(vExt.y);" +

        "float flatDst=distance(tCnt,tCrd);" +

        "vec2 dsth=vec2(tCrd.x-tCnt.x,tCrd.y-tCnt.y)/flatDst;" +

        "float mh=ph-vHS;" +

        "vec2 p;" +
        "float pc;" +

        "if((flg&2)>0&&alp>0.){" +
          "p=tCrd-dsth;" +
          "pc=vHS+((flatDst-1.)/flatDst)*mh;" +

          "tc=texture(uTex,p*vS.zw);" +
          "float h=tc.g*vSC;" +

          "if(h>pc)discard;" +

          "vol*=pow(vol*clcAng(vec2(length(tCrd-p),pc-h),vec2(length(tCnt-p),ph-h)),shn);" +
        "}" +

        "if((flg&1)>0&&vol>0.){" +
          "float hst=(1./flatDst)*mh;" +
          "float l=flatDst-vExt.w;" +
          "float s=max(0.,l-shl);" +
          "for(float i=l;i>s;i-=vExt.w){" +
            "p=tCnt+i*dsth;" +
            "pc=vHS+i*hst;" +
            "tc=texture(uTex,p*vS.zw);" +
            "if(tc.a>0.){" +
              "tc.rg*=vSC;" +
              "if(tc.r<pc&&tc.g>pc){" +
                "vol*=clamp(0.,1.,distance(tCrd,p)/shl);" +
                "break;" +
              "}" +
            "}" +
          "}" +
        "}" +

        "oCl=vec4(vCl.rgb*vCl.a*vol*vDt.z,1);" +
      "}";
    };
  }
);
