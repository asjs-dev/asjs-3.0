require("../NameSpace.js");
require("../utils/agl.Utils.js");

AGL.CreateConfig = function(options) {
  var warnMessage = "Maximum of ";
  if (options.textureNum === undefined || options.textureNum > AGL.Utils.info.maxTextureImageUnits)
    options.textureNum = AGL.Utils.info.maxTextureImageUnits;

  if (options.lightNum === undefined) options.lightNum = 0;
  else if (options.lightNum > AGL.Stage2D.MAX_LIGHT_SOURCES)
    options.lightNum = AGL.Stage2D.MAX_LIGHT_SOURCES;

  var attributes = options.contextAttributes || {};

  return {
    "canvas"            : options.canvas,

    "locations"         : options.locations || {},

    "textureNum"        : options.textureNum,

    "lightNum"          : options.lightNum,
    "isLightEnabled"    : options.lightNum > 0,

    "isMaskEnabled"     : options.isMaskEnabled,

    "vertexShader"      : options.vertexShader,
    "fragmentShader"    : options.fragmentShader,

    "precision"         : options.precision || AGL.RendererHelper.Precisons.HIGH,

    "contextAttributes" : {
      "alpha"              : attributes.alpha || false,
      "antialias"          : attributes.antialias || false,
      "depth"              : attributes.depth || false,
      "stencil"            : attributes.stencil || false,
      "premultipliedAlpha" : attributes.premultipliedAlpha || false,
      "powerPreference"    : attributes.powerPreference || "high-performance"
    }
  };
};
