createUtility(ASJS, "Point");
rof(ASJS.Point, "create", function(x, y) {
  var point = {};
      point.x = x || 0;
      point.y = y || 0;
  return point;
});
