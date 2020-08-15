require("../NameSpace.js");
require("./webGl.AbstractRenderer.js");

WebGl.BaseRenderer = createPrototypeClass(
  WebGl.AbstractRenderer,
  function BaseRenderer(webGlBitmap, vertexShader, fragmentShader, config) {
    WebGl.AbstractRenderer.call(this, webGlBitmap, vertexShader, fragmentShader, {
      "a_position"    : "getAttribLocation",
      "a_matrix"      : "getAttribLocation",
      "a_worldMatrix" : "getAttribLocation",
      "a_texMatrix"   : "getAttribLocation",
      "a_texCrop"     : "getAttribLocation",
      "a_texId"       : "getAttribLocation",
      "u_tex"         : "getUniformLocation",
    }, config);

    this._texIdData   = new Float32Array(this._MAX_BATCH_ITEMS);
    this._texIdBuffer = this._createArrayBuffer(this._texIdData, "a_texId", 1, 1, 1, this._gl.FLOAT, 4);
  },
  function(_super) {
    this._setBufferData = function(item, parent, textureMapIndex, matId, quadId) {
      _super._setBufferData.call(this, item, parent, textureMapIndex, matId, quadId);
      this._texIdData[this._batchItems] = textureMapIndex;
    }

    this._bindBuffers = function() {
      _super._bindBuffers.call(this);
      this._bindArrayBuffer(this._texIdBuffer, this._texIdData);
    }
  }
);
rof(WebGl.BaseRenderer, "createVertexShader", function() {
  var shader = "#version 300 es\n" +

  "in vec2 a_position;" +
  "in mat3 a_matrix;" +
  "in mat3 a_worldMatrix;" +
  "in mat3 a_texMatrix;" +
  "in vec4 a_texCrop;" +
  "in float a_texId;" +

  "out vec2 v_texCoord;" +
  "out vec2 v_texCrop;" +
  "out vec2 v_texCropSize;" +
  "out float v_texId;" +

  "void main(void) {" +
    "vec3 pos = vec3(a_position, 1.0);" +
    "gl_Position = vec4((a_worldMatrix * a_matrix * pos).xy, 0.0, 1.0);" +
    "v_texCoord = (a_texMatrix * pos).xy;" +
    "v_texCrop = a_texCrop.xy;" +
    "v_texCropSize = a_texCrop.zw - a_texCrop.xy;" +
    "v_texId = a_texId;" +
  "}";

  return shader;
});
rof(WebGl.BaseRenderer, "createFragmentShader", function(config) {
  var maxTextureImageUnits = config.textureNum;

  var shader = "#version 300 es\n" +
  "#define MAX_TEXTURES " + maxTextureImageUnits + "\n" +

  "precision lowp float;" +

  "in vec2 v_texCoord;" +
  "in vec2 v_texCrop;" +
  "in vec2 v_texCropSize;" +
  "in float v_texId;" +

  "uniform sampler2D u_tex[MAX_TEXTURES];" +

  "out vec4 fragColor;";

  shader +=
  "void main(void) {";

    for (var i = -1; i < maxTextureImageUnits; i++) {
      shader += (i > -1 ? " else " : "") +
      "if (v_texId < " + (i + 1) + ".5) {";
        shader += i < 0
          ? "fragColor = vec4(0.0, 0.0, 0.0, 0.0);"
          : "fragColor = texture(u_tex[" + i + "], v_texCrop + v_texCropSize * fract(v_texCoord));";
      shader +=
      "}";
    }

    shader +=
  "}";

  return shader;
});
