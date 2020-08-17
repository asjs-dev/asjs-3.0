require("../NameSpace.js");
require("./agl.SimpleRenderer.js");

AGL.MaskRenderer = createPrototypeClass(
  AGL.SimpleRenderer,
  function MaskRenderer(webGlBitmap, vertexShader, fragmentShader, config) {
    AGL.SimpleRenderer.call(this, webGlBitmap, vertexShader, fragmentShader, config);

    webGlBitmap.clearColor.r =
    webGlBitmap.clearColor.g =
    webGlBitmap.clearColor.b =
    webGlBitmap.clearColor.a = 0;
  },
  function() {}
);
rof(AGL.MaskRenderer, "createVertexShader", AGL.SimpleRenderer.createVertexShader);
rof(AGL.MaskRenderer, "createFragmentShader", function(config) {
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
  "void main(void){";

    for (var i = -1; i < maxTextureImageUnits; i++) {
      shader += (i > -1 ? " else " : "") +
      "if(v_texId<" + (i + 1) + ".5){";
        shader += i < 0
          ? "fragColor=vec4(0.0,0.0,0.0,0.0);"
          : "vec4 color=vec4(texture(u_tex[" + i + "],v_texCrop+v_texCropSize*fract(v_texCoord)).a);" +
            "fragColor=vec4(" +
              "vec3(1.0)*((color.r+color.g+color.b)/3.0)," +
              "color.a" +
            ");";
      shader +=
      "}";
    }

    shader +=
  "}";

  return shader;
});
