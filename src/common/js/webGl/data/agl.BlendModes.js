require("../NameSpace.js");
require("../utils/agl.Utils.js");

(function() {
  function createBlendMode(funcs) {
    return {
      "funcName": "blendFunc" + (
        funcs.length === 2
        ? ""
        : "Separate"
      ),
      "funcs": funcs
    };
  }

  AGL.BlendModes = {
    "NORMAL"  : createBlendMode([
      AGL.Consts.SRC_ALPHA,
      AGL.Consts.ONE_MINUS_SRC_ALPHA,
      AGL.Consts.ONE,
      AGL.Consts.ONE_MINUS_SRC_ALPHA
    ]),
    "ADD"     : createBlendMode([
      AGL.Consts.SRC_ALPHA,
      AGL.Consts.DST_ALPHA,
      AGL.Consts.ONE,
      AGL.Consts.DST_ALPHA
    ]),
    "MULTIPLY": createBlendMode([
      AGL.Consts.DST_COLOR,
      AGL.Consts.ONE_MINUS_SRC_ALPHA
    ]),
    "SCREEN"  : createBlendMode([
      AGL.Consts.SRC_ALPHA,
      AGL.Consts.ONE_MINUS_SRC_COLOR,
      AGL.Consts.ONE,
      AGL.Consts.ONE_MINUS_SRC_COLOR
    ]),
    "OVERLAY" : createBlendMode([
      AGL.Consts.ONE,
      AGL.Consts.ONE_MINUS_SRC_ALPHA
    ])
  };

  Object.freeze(AGL.BlendModes);
})();
