require("./asjs.Point.js");

createUtility(ASJS, "Rectangle");
rof(ASJS.Rectangle, "create", function(x, y, w, h) {
  var rect = ASJS.Point.create(x, y);
      rect.width  = w || 0;
      rect.height = h || 0;
  return rect;
});
