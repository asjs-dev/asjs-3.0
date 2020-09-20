require("../NameSpace.js");
require("./agl.SimpleRenderer.js");

AGL.MaskRenderer = helpers.createPrototypeClass(
  AGL.SimpleRenderer,
  function MaskRenderer(config) {
    config.vertexShader   = config.vertexShader   || AGL.MaskRenderer.createVertexShader;
    config.fragmentShader = config.fragmentShader || AGL.MaskRenderer.createFragmentShader;

    AGL.SimpleRenderer.call(this, config);

    this.clearColor.r =
    this.clearColor.g =
    this.clearColor.b =
    this.clearColor.a = 0;
  }
);
AGL.MaskRenderer.createVertexShader = AGL.SimpleRenderer.createVertexShader;
AGL.MaskRenderer.createFragmentShader = function(config) {
  var maxTextureImageUnits = config.textureNum;

  var shader = "#version 300 es\n" +
  "precision lowp float;" +

  "in vec2 vTexCrd;" +
  "in vec2 vTexCrop;" +
  "in vec2 vTexCropSize;" +
  "in float vTexId;" +

  "uniform sampler2D uTex[" + maxTextureImageUnits + "];" +

  "out vec4 fgCol;";

  shader +=
  "void main(void){";

    for (var i = -1; i < maxTextureImageUnits; i++) {
      shader += (i > -1 ? " else " : "") +
      "if(vTexId<" + (i + 1) + ".5){";
        shader += i < 0
          ? "fgCol=vec4(0);"
          : "vec4 col=texture(uTex[" + i + "],vTexCrop+vTexCropSize*fract(vTexCrd));" +
            "fgCol=vec4(1)*((col.r+col.g+col.b+col.a)/4.);";
      shader +=
      "}";
    }

    shader +=
  "}";

  return shader;
};
