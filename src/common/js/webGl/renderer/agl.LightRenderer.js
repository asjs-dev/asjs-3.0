require("../NameSpace.js");
require("./agl.BaseRenderer.js");

AGL.LightRenderer = helpers.createPrototypeClass(
  AGL.BaseRenderer,
  function LightRenderer(options) {
    options                  = options || {};
    options.config           = AGL.Utils.initRendererConfig(options.config, AGL.LightRenderer);
    options.config.locations = options.config.locations.concat([
      "aExt",
      "uS",
      "uSC"
    ]);

    this.heightMap = options.heightMap;

    this._MAX_BATCH_ITEMS = Math.max(1, options.lightNum || 1);

    AGL.BaseRenderer.call(this, options.config);

    this.scale = options.scale;

    this._extensionBuffer = new AGL.Buffer(
      this._MAX_BATCH_ITEMS,
      "aExt", 1, 4
    );

    this._lights = [];
    for (var i = 0; i < this._MAX_BATCH_ITEMS; ++i)
      this._lights.push(new AGL.Light(i, this._matrixBuffer.data, this._extensionBuffer.data));
  },
  function(_scope, _super) {
    helpers.property(_scope, "scale", {
      get: function() { return this._scale; },
      set: function(v) {
        v = Math.max(0, Math.min(1, v || 1));
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
      "#define PI radians(180.)\n" +

      "in vec2 aPos;" +
      "in mat4 aMt;" +
      "in vec4 aExt;" +

      "uniform vec4 uS;" +
      "uniform float uFlpY;" +
      "uniform float uSC;" +

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
      "out float vSC;" +
      "out vec2 vSln;" +

      "void main(void){" +
        "vExt=aExt;" +
        "vCol=aMt[2];" +
        "vDat=aMt[3];" +
        "if(vDat.x>0.){" +
          "vS=uS;" +
          "vSC=uSC;" +
          "vec3 pos=vec3(aPos*2.-1.,1);" +

          "vCrd.xy=pos.xy*vSC;" +
          "vHS=vExt.z*vSC;" +

          "mat3 mt;" +
          "if(vExt.x<1.){" +
            "vExt.w*=vSC;" +
            "mt=mat3(aMt[0].xy,0,aMt[0].zw,0,aMt[1].xy,1);" +
            "gl_Position=vec4(mt*pos,1);" +
            "vTCrd=(gl_Position.xy+H.xy)/H.zw;" +
            "vCrd.zw=(aMt[1].xy+H.xy)/H.zw;" +
            "vSpt=PI-aMt[1].w;" +
            "vD=aMt[1].z*vSC;" +
            "vSln=vec2(sin(vDat.w),cos(vDat.w));" +
          "}else{" +
            "mt=mat3(aMt[0].xy,0,aMt[0].zw,0,-1,1,1);" +
            "gl_Position=vec4(pos,1);" +
            "vTCrd=vec2(aPos.x,1.-aPos.y);" +
            "vCrd.zw=vTCrd+((mt*vec3(1,1,1)).xy+H.xy)/H.zw;" +
          "}" +
          "gl_Position.y*=uFlpY;" +
          "vSC*=255.;" +
        "}" +
      "}";
    };

    _scope._createFragmentShader = function(config) {
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
      "in float vSC;" +
      "in vec2 vSln;" +

      "uniform sampler2D uTex;" +

      "out vec4 fgCol;" +
      /*
      "float rand(vec2 st){" +
        "return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);" +
      "}" +
      */

      "float clcAng(vec2 a,vec2 b){" +
        //"return (a.x*b.x+a.y*b.y)/(length(a)*length(b));" +
        "float c=PIH-atan(a.y,a.x);" +
        "float d=atan(b.y,b.x);" +
        "float e=c-PIH;" +
        "float f=e+(e-d);" +
        "return abs(f-PIH)/PIH;" +
      "}" +

      "void main(void){" +
        "if(vDat.x<1.)discard;" +

        "bool isl=vExt.x<1.;" +

        "vec4 tc=texture(uTex,vTCrd);" +

        "float ph=tc.g*tc.b*255.;" +

        "ph*=vSC;" +

        "vec2 tCrd=vTCrd*vS.xy;" +
        "vec2 tCnt=vCrd.zw*vS.xy;" +
        "float pxDst=distance(vec3(tCnt,vHS),vec3(tCrd,ph));" +
        "float dst=isl?pxDst/vD:ph/vHS;" +

        "if(dst>1.)discard;" +

        "if(isl&&vSpt>0.&&vSpt<PI){" +
          "float slh=(vHS-ph)/255.;" +
          "vec2 sl=vec2(slh*vSln.y-vCrd.x*vSln.x,slh*vSln.x+vCrd.x*vSln.y);" +
          "if(atan(sl.x,length(vec2(sl.y,vCrd.y)))+PIH<vSpt)discard;" +
        "}" +

        "vec4 lcol=vCol;" +
        "float vol=1.-dst;" +

        "int flg=int(vExt.y);" +

        "if(vol>0.){" +
          "float flatDst=distance(tCnt,tCrd);" +

          "float rt=atan(tCrd.y-tCnt.y,tCrd.x-tCnt.x);" +
          "vec2 dsth=vec2(cos(rt),sin(rt));" +

          "float ldsth=length(dsth);" +
          "float mh=ph-vHS;" +

          "vec2 p;" +
          "float pc;" +

          "if((flg&2)>0){" +
            "p=tCrd-dsth;" +
            "pc=vHS+((flatDst-ldsth)/flatDst)*mh;" +

            "tc=texture(uTex,p*vS.zw);" +
            "tc.g*=tc.b*255.*vSC;" +

            "if(tc.g>pc)discard;" +

            "vol*=clcAng(vec2(length(tCrd-p),pc-tc.g),vec2(length(tCnt-p),ph-tc.g));" +
          "}" +

          "if((flg&1)>0&&vol>0.){" +
            "float lst=max(ldsth,flatDst/vExt.w);" +

            "float l=flatDst-lst*2.;" +
            "for(float i=lst;i<l;i+=lst){" +
              "p=tCnt+i*dsth;" +
              "pc=vHS+((i*ldsth)/flatDst)*mh;" +

              "tc=texture(uTex,p*vS.zw);" +
              "if(tc.b>0.){" +
                "tc.rg*=tc.b*255.*vSC;" +
                "if(tc.r<pc&&tc.g>pc)discard;" +
              "}" +
            "}" +
          "}" +
        "}" +

        "fgCol=vec4(lcol.rgb*vol*vDat.z,1);" +
      "}";
    };
  }
);
