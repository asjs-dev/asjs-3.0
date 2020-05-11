createUtility(ASJS, "Point");
rof(ASJS.Point, "create", function(x, y) {
  var point = {};
      point.x = valueOrDefault(x, 0);
      point.y = valueOrDefault(y, 0);
  return point;
});
