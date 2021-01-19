require("../NameSpace.js");
require("../utils/agl.Utils.js");

AGL.createBlendMode = function(funcs, eqs) {
  return {
    funcName: "blendFunc" + (
      funcs.length < 3
      ? ""
      : "Separate"
    ),
    funcs: funcs,
    eqName: "blendEquation" + (
      !eqs || eqs.length < 2
      ? ""
      : "Separate"
    ),
    eqs: eqs || [AGLC.FUNC_ADD]
  };
};

AGL.BlendMode = {
  NONE : AGL.createBlendMode([
    0,
    0
  ]),

  NORMAL_PM : AGL.createBlendMode([
    AGLC.ONE,
    AGLC.ONE_MINUS_SRC_ALPHA
  ]),
  ADD_PM : AGL.createBlendMode([
    AGLC.ONE,
    AGLC.ONE
  ]),
  MULTIPLY_PM : AGL.createBlendMode([
    AGLC.DST_COLOR,
    AGLC.ONE_MINUS_SRC_ALPHA,
    AGLC.ONE,
    AGLC.ONE_MINUS_SRC_ALPHA
  ]),
  SCREEN_PM : AGL.createBlendMode([
    AGLC.ONE,
    AGLC.ONE_MINUS_SRC_COLOR,
    AGLC.ONE,
    AGLC.ONE_MINUS_SRC_ALPHA
  ]),

  ADD_NPM : AGL.createBlendMode([
    AGLC.SRC_ALPHA,
    AGLC.ONE,
    AGLC.ONE,
    AGLC.ONE
  ]),

  SRC_IN : AGL.createBlendMode([
    AGLC.DST_ALPHA,
    AGLC.ZERO
  ]),
  SRC_OUT : AGL.createBlendMode([
    AGLC.ONE_MINUS_DST_ALPHA,
    AGLC.ZERO
  ]),
  SRC_ATOP : AGL.createBlendMode([
    AGLC.DST_ALPHA,
    AGLC.ONE_MINUS_SRC_ALPHA
  ]),
  DST_OVER : AGL.createBlendMode([
    AGLC.ONE_MINUS_DST_ALPHA,
    AGLC.ONE
  ]),
  DST_IN : AGL.createBlendMode([
    AGLC.ZERO,
    AGLC.SRC_ALPHA
  ]),
  DST_OUT : AGL.createBlendMode([
    AGLC.ZERO,
    AGLC.ONE_MINUS_SRC_ALPHA
  ]),
  DST_ATOP : AGL.createBlendMode([
    AGLC.ONE_MINUS_DST_ALPHA,
    AGLC.SRC_ALPHA
  ]),
  XOR : AGL.createBlendMode([
    AGLC.ONE_MINUS_DST_ALPHA,
    AGLC.ONE_MINUS_SRC_ALPHA
  ]),

  NORMAL : AGL.createBlendMode([
    AGLC.SRC_ALPHA,
    AGLC.ONE_MINUS_SRC_ALPHA,
    AGLC.ONE,
    AGLC.ONE_MINUS_SRC_ALPHA
  ]),
  ADD : AGL.createBlendMode([
    AGLC.SRC_ALPHA,
    AGLC.DST_ALPHA,
    AGLC.ONE,
    AGLC.DST_ALPHA
  ]),
  MULTIPLY : AGL.createBlendMode([
    AGLC.DST_COLOR,
    AGLC.ONE_MINUS_SRC_ALPHA
  ]),
  SCREEN : AGL.createBlendMode([
    AGLC.SRC_ALPHA,
    AGLC.ONE_MINUS_SRC_COLOR,
    AGLC.ONE,
    AGLC.ONE_MINUS_SRC_COLOR
  ]),
  OVERLAY : AGL.createBlendMode([
    AGLC.ONE,
    AGLC.ONE_MINUS_SRC_ALPHA
  ]),
  EXCLUSION : AGL.createBlendMode([
    AGLC.ONE_MINUS_DST_COLOR,
    AGLC.ONE_MINUS_SRC_COLOR
  ])
};
