require("./asjs.Point.js");
ASJS.Rectangle = {};
helpers.constant(ASJS.Rectangle, "create", function(x, y, w, h) {
  var rect = ASJS.Point.create(x, y);
      rect.width  = helpers.valueOrDefault(w, 0);
      rect.height = helpers.valueOrDefault(h, 0);
  return rect;
});
