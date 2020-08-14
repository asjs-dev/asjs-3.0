require("../NameSpace.js");

createUtility(WebGl, "Config");
rof(WebGl.Config, "create", function(lightsNum, textureNum, useMask, filters) {
  if (lightsNum > WebGl.Stage2D.MAX_LIGHT_SOURCES) {
    console.warn("Maximum of lights is " + WebGl.Stage2D.MAX_LIGHT_SOURCES);
    lightsNum = WebGl.Stage2D.MAX_LIGHT_SOURCES;
  }

  if (textureNum > WebGl.Utils.instance.webGlInfo.maxTextureImageUnits) {
    console.warn("Maximum of texture units is " + WebGl.Stage2D.MAX_LIGHT_SOURCES);
    textureNum = WebGl.Utils.instance.webGlInfo.maxTextureImageUnits;
  }

  return {
    "lightsNum"  : lightsNum,
    "showLights" : lightsNum > 0,
    "textureNum" : textureNum,
    "useMask"    : useMask,
    "filters"    : filters,
    "useFilters" : filters && filters.length > 0
  };
});
