require("../NameSpace.js");
require("../utils/agl.Utils.js");

(function() {
  function createBlendMode(funcs) {
    return {
      funcName: "blendFunc" + (
        funcs.length < 3
        ? ""
        : "Separate"
      ),
      funcs: funcs
    };
  }

  AGL.BlendMode = {
    NONE : createBlendMode([
      0,
      0
    ]),

    NORMAL_PM : createBlendMode([
      AGL.Const.ONE,
      AGL.Const.ONE_MINUS_SRC_ALPHA
    ]),
    ADD_PM : createBlendMode([
      AGL.Const.ONE,
      AGL.Const.ONE
    ]),
    MULTIPLY_PM : createBlendMode([
      AGL.Const.DST_COLOR,
      AGL.Const.ONE_MINUS_SRC_ALPHA,
      AGL.Const.ONE,
      AGL.Const.ONE_MINUS_SRC_ALPHA
    ]),
    SCREEN_PM : createBlendMode([
      AGL.Const.ONE,
      AGL.Const.ONE_MINUS_SRC_COLOR,
      AGL.Const.ONE,
      AGL.Const.ONE_MINUS_SRC_ALPHA
    ]),

    ADD_NPM : createBlendMode([
      AGL.Const.SRC_ALPHA,
      AGL.Const.ONE,
      AGL.Const.ONE,
      AGL.Const.ONE
    ]),

    SRC_IN : createBlendMode([
      AGL.Const.DST_ALPHA,
      AGL.Const.ZERO
    ]),
    SRC_OUT : createBlendMode([
      AGL.Const.ONE_MINUS_DST_ALPHA,
      AGL.Const.ZERO
    ]),
    SRC_ATOP : createBlendMode([
      AGL.Const.DST_ALPHA,
      AGL.Const.ONE_MINUS_SRC_ALPHA
    ]),
    DST_OVER : createBlendMode([
      AGL.Const.ONE_MINUS_DST_ALPHA,
      AGL.Const.ONE
    ]),
    DST_IN : createBlendMode([
      AGL.Const.ZERO,
      AGL.Const.SRC_ALPHA
    ]),
    DST_OUT : createBlendMode([
      AGL.Const.ZERO,
      AGL.Const.ONE_MINUS_SRC_ALPHA
    ]),
    DST_ATOP : createBlendMode([
      AGL.Const.ONE_MINUS_DST_ALPHA,
      AGL.Const.SRC_ALPHA
    ]),
    XOR : createBlendMode([
      AGL.Const.ONE_MINUS_DST_ALPHA,
      AGL.Const.ONE_MINUS_SRC_ALPHA
    ]),

    NORMAL : createBlendMode([
      AGL.Const.SRC_ALPHA,
      AGL.Const.ONE_MINUS_SRC_ALPHA,
      AGL.Const.ONE,
      AGL.Const.ONE_MINUS_SRC_ALPHA
    ]),
    ADD : createBlendMode([
      AGL.Const.SRC_ALPHA,
      AGL.Const.DST_ALPHA,
      AGL.Const.ONE,
      AGL.Const.DST_ALPHA
    ]),
    MULTIPLY : createBlendMode([
      AGL.Const.DST_COLOR,
      AGL.Const.ONE_MINUS_SRC_ALPHA
    ]),
    SCREEN : createBlendMode([
      AGL.Const.SRC_ALPHA,
      AGL.Const.ONE_MINUS_SRC_COLOR,
      AGL.Const.ONE,
      AGL.Const.ONE_MINUS_SRC_COLOR
    ]),
    OVERLAY : createBlendMode([
      AGL.Const.ONE,
      AGL.Const.ONE_MINUS_SRC_ALPHA
    ]),
    EXCLUSION : createBlendMode([
      AGL.Const.ONE_MINUS_DST_COLOR,
      AGL.Const.ONE_MINUS_SRC_COLOR
    ])
  };
})();
