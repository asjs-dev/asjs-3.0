require("../NameSpace.js");

(function() {
  var oneMinusSrcAlpha = "ONE_MINUS_SRC_ALPHA";
  var oneMinusSrcColor = "ONE_MINUS_SRC_COLOR";
  var srcAlpha         = "SRC_ALPHA";
  var dstAlpha         = "DST_ALPHA";
  var one              = "ONE";

  function createBlendMode(funcs) {
    return {
      "funcName": funcs.length === 2
        ? "blendFunc"
        : "blendFuncSeparate",
      "funcs": funcs
    };
  }

  AGL.BlendModes = {
    "NORMAL"  : createBlendMode([srcAlpha, oneMinusSrcAlpha, one, oneMinusSrcAlpha]),
    "ADD"     : createBlendMode([srcAlpha, dstAlpha, one, dstAlpha]),
    "MULTIPLY": createBlendMode(["DST_COLOR", oneMinusSrcAlpha]),
    "SCREEN"  : createBlendMode([srcAlpha, oneMinusSrcColor, one, oneMinusSrcColor]),
    "OVERLAY" : createBlendMode([one, oneMinusSrcAlpha])
  };
  
  Object.freeze(AGL.BlendModes);
})();
