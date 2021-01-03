require("../NameSpace.js");
require("./agl.RendererHelper.js");

AGL.LightRenderer = helpers.createPrototypeClass(
  helpers.BasePrototypeClass,
  function LightRenderer(config, shadowMap) {
    helpers.BasePrototypeClass.call(this);

    config = AGL.RendererHelper.initConfig(config, AGL.LightRenderer);

    config.contextAttributes                    = config.contextAttributes || {};
    config.contextAttributes.alpha              = true;
    config.contextAttributes.premultipliedAlpha = false;

    config.locations = config.locations.concat([
      "aMt"
    ]);

    this.shadowMap = shadowMap;

    this._lightData = new Float32Array(config.lightNum * 16);

    this._lights = [];

    var l = config.lightNum;
    for (var i = 0; i < l; ++i) this._lights.push(new AGL.Light(i, this._lightData));

    AGL.RendererHelper.initRenderer.call(this, config);
  },
  function(_scope, _super) {
    AGL.RendererHelper.createRendererBody.call(_scope, _scope);

    helpers.get(_scope, "stage",  function() { return this; });

    _scope._render = function() {
      this._gl.clear(AGL.Const.COLOR_BUFFER_BIT);

      if (this.shadowMap && this.shadowMap.isNeedToDraw(this._gl, this._renderTime))
        AGL.Utils.useTexture(this._gl, 0, this.shadowMap);

      this._bindArrayBuffer(this._lightBuffer, this._lightData);
      this._gl.drawElementsInstanced(AGL.Const.TRIANGLE_FAN, 6, AGL.Const.UNSIGNED_SHORT, 0, this._lights.length);

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
      this._gl.bindBuffer(AGL.Const.ELEMENT_ARRAY_BUFFER, this._gl.createBuffer());
      this._gl.bufferData(
        AGL.Const.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([
          0, 1, 2,
          0, 2, 3
        ]),
        AGL.Const.STATIC_DRAW
      );

      this._gl.uniform1i(this._locations.uTex, 0);

  		this._lightBuffer = this._createArrayBuffer(this._lightData, "aMt", 16, 4, 4, AGL.Const.FLOAT, 4);

      this._useBlendMode(AGL.BlendMode.ADD);

      this._gl.clearColor(0, 0, 0, 1);
    }
  }
);
AGL.LightRenderer.createVertexShader = function() {
  return
  "#version 300 es\n" +

  "in vec2 aPos;" +
  "in mat4 aMt;" +

  "out vec2 vTexCrd;" +
  "out vec4 vCrd;" +
  "out vec4 vCol;" +
  "out vec4 vDat;" +

  "void main(void){" +
    "mat3 mt=mat3(aMt[0].xy,0,aMt[0].zw,0,aMt[1].xy,1);" +
    "vec3 pos=vec3(aPos*2.-1.,1);" +
    "vCrd.xy=pos.xy;" +
    "gl_Position=vec4(mt*pos,1);" +
    "vTexCrd=(gl_Position.xy+vec2(1,-1))/vec2(2,-2);" +
    "vCrd.zw=((mt*vec3(0,0,1)).xy+vec2(1,-1))/vec2(2,-2);" +
    "vCol=aMt[2];" +
    "vDat=aMt[3];" +
  "}";
};
AGL.LightRenderer.createFragmentShader = function(config) {
  var shader =
  "#version 300 es\n" +
  "precision " + config.precision + " float;" +

  "in vec2 vTexCrd;" +
  "in vec4 vCrd;" +
  "in vec4 vCol;" +
  "in vec4 vDat;" +

  "uniform sampler2D uTex;" +

  "out vec4 fgCol;" +

  "void main(void){" +
    "float dst=distance(vec2(0),vCrd.xy);" +
    "if(dst>1.||vDat.x==0.)discard;" +
    "vec2 pxp=1./vec2(textureSize(uTex,0));" +
    "vec3 rgb=vCol.rgb;" +
    "if(pxp.x<1.&&pxp.y<1.){" +
      "vec4 tc;" +
      "vec4 c=vec4(0);" +
      "float dstTex=distance(vTexCrd,vCrd.zw);" +
      "vec2 m=(vTexCrd-vCrd.zw)/dstTex;" +
      "vec2 p;" +
      "vec2 s;" +
      "for(float i=0.;i<dstTex;i+=.005){" +
        "s=i*m;" +
        "p=vCrd.zw+s;" +
        "if(p.x>=0.&&p.y>=0.&&p.x<=1.&&p.y<=1.){" +
          "tc=texture(uTex,p);" +
          "c=vec4(c.rgb+rgb*tc.rgb,c.a+tc.a*tc.a);" +
          "if(c.a>=1.)discard;" +
        "}" +
      "}" +
      "rgb=rgb*(1.-c.a)+c.rgb;" +
    "}" +
    "fgCol=vec4(rgb*clamp((1.-dst)*vDat.y,0.,1.)*vDat.z,1);" +
  "}";

  return shader;
};
