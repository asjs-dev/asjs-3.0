require("../NameSpace.js");

AGL.Rect = {
  create : function(x, y, width, height) {
    return {
      x      : x      || 0,
      y      : y      || 0,
      width  : width  || 0,
      height : height || 0
    };
  },
  toRelativeSize : function(rect, width, height) {
    return {
      x      : rect.x      / width,
      y      : rect.y      / height,
      width  : rect.width  / width,
      height : rect.height / height
    };
  }
};
