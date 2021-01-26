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
    eqs: eqs || [{{AGL.Const.FUNC_ADD}}]
  };
};

AGL.BlendMode = {
  NONE : AGL.createBlendMode([
    0,
    0
  ]),

  SIMPLE : AGL.createBlendMode([
    {{AGL.Const.ONE}},
    {{AGL.Const.ONE}}
  ]),
  NORMAL_PM : AGL.createBlendMode([
    {{AGL.Const.ONE}},
    {{AGL.Const.ONE_MINUS_SRC_ALPHA}}
  ]),
  ADD_PM : AGL.createBlendMode([
    {{AGL.Const.ONE}},
    {{AGL.Const.ONE}}
  ]),
  MULTIPLY_PM : AGL.createBlendMode([
    {{AGL.Const.DST_COLOR}},
    {{AGL.Const.ONE_MINUS_SRC_ALPHA}},
    {{AGL.Const.ONE}},
    {{AGL.Const.ONE_MINUS_SRC_ALPHA}}
  ]),
  SCREEN_PM : AGL.createBlendMode([
    {{AGL.Const.ONE}},
    {{AGL.Const.ONE_MINUS_SRC_COLOR}},
    {{AGL.Const.ONE}},
    {{AGL.Const.ONE_MINUS_SRC_ALPHA}}
  ]),

  ADD_NPM : AGL.createBlendMode([
    {{AGL.Const.SRC_ALPHA}},
    {{AGL.Const.ONE}},
    {{AGL.Const.ONE}},
    {{AGL.Const.ONE}}
  ]),

  SRC_IN : AGL.createBlendMode([
    {{AGL.Const.DST_ALPHA}},
    {{AGL.Const.ZERO}}
  ]),
  SRC_OUT : AGL.createBlendMode([
    {{AGL.Const.ONE_MINUS_DST_ALPHA}},
    {{AGL.Const.ZERO}}
  ]),
  SRC_ATOP : AGL.createBlendMode([
    {{AGL.Const.DST_ALPHA}},
    {{AGL.Const.ONE_MINUS_SRC_ALPHA}}
  ]),
  DST_OVER : AGL.createBlendMode([
    {{AGL.Const.ONE_MINUS_DST_ALPHA}},
    {{AGL.Const.ONE}}
  ]),
  DST_IN : AGL.createBlendMode([
    {{AGL.Const.ZERO}},
    {{AGL.Const.SRC_ALPHA}}
  ]),
  DST_OUT : AGL.createBlendMode([
    {{AGL.Const.ZERO}},
    {{AGL.Const.ONE_MINUS_SRC_ALPHA}}
  ]),
  DST_ATOP : AGL.createBlendMode([
    {{AGL.Const.ONE_MINUS_DST_ALPHA}},
    {{AGL.Const.SRC_ALPHA}}
  ]),
  XOR : AGL.createBlendMode([
    {{AGL.Const.ONE_MINUS_DST_ALPHA}},
    {{AGL.Const.ONE_MINUS_SRC_ALPHA}}
  ]),

  NORMAL : AGL.createBlendMode([
    {{AGL.Const.SRC_ALPHA}},
    {{AGL.Const.ONE_MINUS_SRC_ALPHA}},
    {{AGL.Const.ONE}},
    {{AGL.Const.ONE_MINUS_SRC_ALPHA}}
  ]),
  ADD : AGL.createBlendMode([
    {{AGL.Const.SRC_ALPHA}},
    {{AGL.Const.DST_ALPHA}},
    {{AGL.Const.ONE}},
    {{AGL.Const.DST_ALPHA}}
  ]),
  MULTIPLY : AGL.createBlendMode([
    {{AGL.Const.DST_COLOR}},
    {{AGL.Const.ONE_MINUS_SRC_ALPHA}}
  ]),
  SCREEN : AGL.createBlendMode([
    {{AGL.Const.SRC_ALPHA}},
    {{AGL.Const.ONE_MINUS_SRC_COLOR}},
    {{AGL.Const.ONE}},
    {{AGL.Const.ONE_MINUS_SRC_COLOR}}
  ]),
  OVERLAY : AGL.createBlendMode([
    {{AGL.Const.ONE}},
    {{AGL.Const.ONE_MINUS_SRC_ALPHA}}
  ]),
  EXCLUSION : AGL.createBlendMode([
    {{AGL.Const.ONE_MINUS_DST_COLOR}},
    {{AGL.Const.ONE_MINUS_SRC_COLOR}}
  ])
};
