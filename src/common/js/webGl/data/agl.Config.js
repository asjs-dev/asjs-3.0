require("../NameSpace.js");

AGL.CreateConfig = function(options) {
  var warnMessage = "Maximum of ";
  if (options.textureNum === undefined || options.textureNum > AGL.Utils.info.maxTextureImageUnits) {
    console.warn(warnMessage + "texture units is " + AGL.Stage2D.MAX_LIGHT_SOURCES);
    options.textureNum = AGL.Utils.info.maxTextureImageUnits;
  }

  if (options.lightNum === undefined) options.lightNum = 0;
  else if (options.lightNum > AGL.Stage2D.MAX_LIGHT_SOURCES) {
    console.warn(warnMessage + "lights is " + AGL.Stage2D.MAX_LIGHT_SOURCES);
    options.lightNum = AGL.Stage2D.MAX_LIGHT_SOURCES;
  }

  var attributes = options.contextAttributes || {};

  var config = {
    "textureNum"        : options.textureNum,

    "lightNum"          : options.lightNum,
    "isLightEnabled"    : options.lightNum > 0,

    "isMaskEnabled"     : options.isMaskEnabled,

    "filters"           : options.filters,
    "isFilterEnabled"   : options.filters && options.filters.length > 0,

    "contextAttributes" : {
      "alpha"              : attributes.alpha || false,
      "antialias"          : attributes.antialias || false,
      "depth"              : attributes.depth || false,
      "stencil"            : attributes.stencil || false,
      "premultipliedAlpha" : attributes.premultipliedAlpha || false,
      "powerPreference"    : attributes.powerPreference || "high-performance"
    }
  };
  Object.freeze(config);
  return config;
};
