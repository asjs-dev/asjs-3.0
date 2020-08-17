require("../NameSpace.js");

createUtility(AGL, "BlendModes");
AGL.BlendModes.NORMAL   = ["SRC_ALPHA", "ONE_MINUS_SRC_ALPHA", "ONE", "ONE_MINUS_SRC_ALPHA"];
AGL.BlendModes.ADD      = ["SRC_ALPHA", "DST_ALPHA", "ONE", "DST_ALPHA"];
AGL.BlendModes.MULTIPLY = ["DST_COLOR", "ONE_MINUS_SRC_ALPHA"];
AGL.BlendModes.SCREEN   = ["SRC_ALPHA", "ONE_MINUS_SRC_COLOR", "ONE", "ONE_MINUS_SRC_COLOR"];
AGL.BlendModes.OVERLAY  = ["ONE", "ONE_MINUS_SRC_ALPHA"];
