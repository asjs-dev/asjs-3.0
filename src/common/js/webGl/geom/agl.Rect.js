require("../NameSpace.js");

AGL.Rect = {
  "create" : function(x, y, width, height) {
    return {
      "x"      : x      || 0,
      "y"      : y      || 0,
      "width"  : width  || 0,
      "height" : height || 0
    };
  }
};
