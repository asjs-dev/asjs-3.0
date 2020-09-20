ASJS.Point = {};
helpers.constant(ASJS.Point, "create", function(x, y) {
  var point = {};
      point.x = helpers.valueOrDefault(x, 0);
      point.y = helpers.valueOrDefault(y, 0);
  return point;
});
