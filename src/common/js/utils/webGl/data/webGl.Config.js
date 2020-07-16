require("../NameSpace.js");

createUtility(WebGl, "Config");
rof(WebGl.Config, "create", function(showLights, useMask, filters) {
  return {
    "showLights" : showLights,
    "useMask"    : useMask,
    "filters"    : filters
  };
});
