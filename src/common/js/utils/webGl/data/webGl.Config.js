require("../NameSpace.js");

createUtility(WebGl, "Config");
rof(WebGl.Config, "create", function(options) {
  if (options.textureNum === undefined || options.textureNum > WebGl.Utils.instance.webGlInfo.maxTextureImageUnits) {
    console.warn("Maximum of texture units is " + WebGl.Stage2D.MAX_LIGHT_SOURCES);
    options.textureNum = WebGl.Utils.instance.webGlInfo.maxTextureImageUnits;
  }

  if (options.lightsNum === undefined) options.lightsNum = 0;
  else if (options.lightsNum > WebGl.Stage2D.MAX_LIGHT_SOURCES) {
    console.warn("Maximum of lights is " + WebGl.Stage2D.MAX_LIGHT_SOURCES);
    options.lightsNum = WebGl.Stage2D.MAX_LIGHT_SOURCES;
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
