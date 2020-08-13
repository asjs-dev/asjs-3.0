require("../NameSpace.js");

createUtility(WebGl, "Config");
rof(WebGl.Config, "create", function(lightsNum, useMask, filters) {
  lightsNum = Math.min(lightsNum, WebGl.Stage2D.MAX_LIGHT_SOURCES);
  return {
    "lightsNum"  : lightsNum,
    "showLights" : lightsNum > 0,
    "useMask"    : useMask,
    "filters"    : filters
  };
});
