require("../NameSpace.js");

(function() {
  function createBlendMode(funcs) {
    return {
      "funcName": funcs.length === 2
        ? "blendFunc"
        : "blendFuncSeparate",
      "funcs": funcs
    };
  }
  AGL.BlendModes = {
    "NORMAL"  : createBlendMode(["SRC_ALPHA", "ONE_MINUS_SRC_ALPHA", "ONE", "ONE_MINUS_SRC_ALPHA"]),
    "ADD"     : createBlendMode(["SRC_ALPHA", "DST_ALPHA", "ONE", "DST_ALPHA"]),
    "MULTIPLY": createBlendMode(["DST_COLOR", "ONE_MINUS_SRC_ALPHA"]),
    "SCREEN"  : createBlendMode(["SRC_ALPHA", "ONE_MINUS_SRC_COLOR", "ONE", "ONE_MINUS_SRC_COLOR"]),
    "OVERLAY" : createBlendMode(["ONE", "ONE_MINUS_SRC_ALPHA"])
  };
  Object.freeze(AGL.BlendModes);
})();
