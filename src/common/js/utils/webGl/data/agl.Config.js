require("../NameSpace.js");

createUtility(AGL, "Config");
rof(AGL.Config, "create", function(options) {
  if (options.textureNum === undefined || options.textureNum > AGL.Utils.instance.info.maxTextureImageUnits) {
    console.warn("Maximum of texture units is " + AGL.Stage2D.MAX_LIGHT_SOURCES);
    options.textureNum = AGL.Utils.instance.info.maxTextureImageUnits;
  }

  if (options.lightsNum === undefined) options.lightsNum = 0;
  else if (options.lightsNum > AGL.Stage2D.MAX_LIGHT_SOURCES) {
    console.warn("Maximum of lights is " + AGL.Stage2D.MAX_LIGHT_SOURCES);
    options.lightsNum = AGL.Stage2D.MAX_LIGHT_SOURCES;
  }

  var config = {
    "textureNum"      : options.textureNum,

    "lightsNum"       : options.lightsNum,
    "isLightEnabled"  : options.lightsNum > 0,

    "isMaskEnabled"   : options.isMaskEnabled,

    "filters"         : options.filters,
    "isFilterEnabled" : options.filters && options.filters.length > 0
  };
  Object.freeze(config);

  return config;
});
