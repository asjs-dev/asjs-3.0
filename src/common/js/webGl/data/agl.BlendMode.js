require("../NameSpace.js");
require("../utils/agl.Utils.js");

(function() {
  function createBlendMode(funcs) {
    return {
      "funcName": "blendFunc" + (
        funcs.length < 3
        ? ""
        : "Separate"
      ),
      "funcs": funcs
    };
  }

  AGL.BlendMode = {
    "NORMAL" : createBlendMode([
      AGL.Const.SRC_ALPHA,
      AGL.Const.ONE_MINUS_SRC_ALPHA,
      AGL.Const.ONE,
      AGL.Const.ONE_MINUS_SRC_ALPHA
    ]),
    "ADD" : createBlendMode([
      AGL.Const.SRC_ALPHA,
      AGL.Const.DST_ALPHA,
      AGL.Const.ONE,
      AGL.Const.DST_ALPHA
    ]),
    "MULTIPLY": createBlendMode([
      AGL.Const.DST_COLOR,
      AGL.Const.ONE_MINUS_SRC_ALPHA
    ]),
    "SCREEN" : createBlendMode([
      AGL.Const.SRC_ALPHA,
      AGL.Const.ONE_MINUS_SRC_COLOR,
      AGL.Const.ONE,
      AGL.Const.ONE_MINUS_SRC_COLOR
    ]),
    "OVERLAY" : createBlendMode([
      AGL.Const.ONE,
      AGL.Const.ONE_MINUS_SRC_ALPHA
    ]),
    "EXCLUSION" : createBlendMode([
      AGL.Const.ONE_MINUS_DST_COLOR,
      AGL.Const.ONE_MINUS_SRC_COLOR
    ])
  };
})();
