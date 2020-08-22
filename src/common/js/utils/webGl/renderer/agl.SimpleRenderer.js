require("../NameSpace.js");
require("./agl.BaseRenderer.js");

AGL.SimpleRenderer = createPrototypeClass(
  AGL.BaseRenderer,
  function SimpleRenderer(webGlBitmap, vertexShader, fragmentShader, config) {
    AGL.BaseRenderer.call(this, webGlBitmap, vertexShader, fragmentShader, {
      "a_texId" : "getAttribLocation",
    }, config);

    this._texIdData   = new Float32Array(this._MAX_BATCH_ITEMS);
    this._texIdBuffer = this._createArBuf(this._texIdData, "a_texId", 1, 1, 1, this._gl.FLOAT, 4);
  },
  function(_super) {
    this._setBufDat = function(item, parent, textureMapIndex, matId, quadId) {
      _super._setBufDat.call(this, item, parent, textureMapIndex, matId, quadId);
      this._texIdData[this._batchItems] = textureMapIndex;
    }

    this._bindBufs = function() {
      _super._bindBufs.call(this);
      this._bindArBuf(this._texIdBuffer, this._texIdData);
    }
  }
);
rof(AGL.SimpleRenderer, "createVertexShader", function() {
  var shader = "#version 300 es\n" +

  "in vec2 a_pos;" +
  "in mat3 a_mat;" +
  "in mat3 a_worldMat;" +
  "in mat3 a_texMat;" +
  "in vec4 a_texCrop;" +
  "in float a_texId;" +

  "out vec2 v_texCoord;" +
  "out vec2 v_texCrop;" +
  "out vec2 v_texCropSize;" +
  "out float v_texId;" +

  "void main(void){" +
    "vec3 pos=vec3(a_pos,1.0);" +
    "gl_Position=vec4((a_worldMat*a_mat*pos).xy,0.0,1.0);" +
    "v_texCoord=(a_texMat*pos).xy;" +
    "v_texCrop=a_texCrop.xy;" +
    "v_texCropSize=a_texCrop.zw-a_texCrop.xy;" +
    "v_texId=a_texId;" +
  "}";

  return shader;
});
rof(AGL.SimpleRenderer, "createFragmentShader", function(config) {
  var maxTextureImageUnits = config.textureNum;

  var shader = "#version 300 es\n" +
  "#define MAX_TEXTURES " + maxTextureImageUnits + "\n" +

  "precision lowp float;" +

  "in vec2 v_texCoord;" +
  "in vec2 v_texCrop;" +
  "in vec2 v_texCropSize;" +
  "in float v_texId;" +

  "uniform sampler2D u_tex[MAX_TEXTURES];" +

  "out vec4 fgCol;";

  shader +=
  "void main(void){";

    for (var i = -1; i < maxTextureImageUnits; i++) {
      shader += (i > -1 ? " else " : "") +
      "if(v_texId<" + (i + 1) + ".5){";
        shader += "fgCol=" + (
          i < 0
            ? "vec4(0.0,0.0,0.0,0.0);"
            : "texture(u_tex[" + i + "],v_texCrop+v_texCropSize*fract(v_texCoord));"
        );
      shader +=
      "}";
    }

    shader +=
  "}";

  return shader;
});
