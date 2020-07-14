require("../NameSpace.js");

createUtility(WebGl, "BlendModes");
cnst(WebGl.BlendModes, "NORMAL",   ["SRC_ALPHA", "ONE_MINUS_SRC_ALPHA", "ONE", "ONE_MINUS_SRC_ALPHA"]);
cnst(WebGl.BlendModes, "ADD",      ["SRC_ALPHA", "DST_ALPHA", "ONE", "DST_ALPHA"]);
cnst(WebGl.BlendModes, "MULTIPLY", ["DST_COLOR", "ONE_MINUS_SRC_ALPHA"]);
cnst(WebGl.BlendModes, "SCREEN",   ["SRC_ALPHA", "ONE_MINUS_SRC_COLOR", "ONE", "ONE_MINUS_SRC_COLOR"]);
cnst(WebGl.BlendModes, "OVERLAY",  ["ONE", "ONE_MINUS_SRC_ALPHA"]);
