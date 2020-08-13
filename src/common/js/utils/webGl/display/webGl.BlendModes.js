require("../NameSpace.js");

createUtility(WebGl, "BlendModes");
WebGl.BlendModes.NORMAL   = ["SRC_ALPHA", "ONE_MINUS_SRC_ALPHA", "ONE", "ONE_MINUS_SRC_ALPHA"];
WebGl.BlendModes.ADD      = ["SRC_ALPHA", "DST_ALPHA", "ONE", "DST_ALPHA"];
WebGl.BlendModes.MULTIPLY = ["DST_COLOR", "ONE_MINUS_SRC_ALPHA"];
WebGl.BlendModes.SCREEN   = ["SRC_ALPHA", "ONE_MINUS_SRC_COLOR", "ONE", "ONE_MINUS_SRC_COLOR"];
WebGl.BlendModes.OVERLAY  = ["ONE", "ONE_MINUS_SRC_ALPHA"];
