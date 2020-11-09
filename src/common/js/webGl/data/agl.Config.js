require("../NameSpace.js");
require("../utils/agl.Utils.js");

AGL.CreateConfig = function(options) {
  if (options.lightNum === undefined) options.lightNum = 0;
  else if (options.lightNum > AGL.Stage2D.MAX_LIGHT_SOURCES) options.lightNum = AGL.Stage2D.MAX_LIGHT_SOURCES;

  var attributes = options.contextAttributes || {};

  return {
    "canvas"         : options.canvas,

    "locations"      : options.locations || {},

    "lightNum"       : options.lightNum,
    "isLightEnabled" : options.lightNum > 0,

    "isMaskEnabled"  : options.isMaskEnabled,

    "vertexShader"   : options.vertexShader,
    "fragmentShader" : options.fragmentShader,

    "precision"      : options.precision || AGL.RendererHelper.Precisons.HIGH,

    "maxBatchItems"  : options.maxBatchItems || 1e4,

    "contextAttributes" : {
      "alpha"                 : attributes.alpha || false,
      "antialias"             : attributes.antialias || false,
      "depth"                 : attributes.depth || false,
      "stencil"               : attributes.stencil || false,
      "premultipliedAlpha"    : attributes.premultipliedAlpha || false,
      "powerPreference"       : attributes.powerPreference || "high-performance",
      "preserveDrawingBuffer" : attributes.preserveDrawingBuffer || false,
    }
  };
};
