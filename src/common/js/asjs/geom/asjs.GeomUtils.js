require("./asjs.Point.js");

ASJS.GeomUtils = {};
cnst(ASJS.GeomUtils, "THETA", Math.PI / 180);

rof(ASJS.GeomUtils, "pointInOrigo", function(point) {
  return point.x === 0 && point.y === 0;
});

rof(ASJS.GeomUtils, "twoPointDistance", function(pointA, pointB) {
  return Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2));
});

rof(ASJS.GeomUtils, "pointInRect", function(point, rect) {
  return point.x >= rect.x && point.x <= rect.x + rect.width &&
         point.y >= rect.y && point.y <= rect.y + rect.height;
});

rof(ASJS.GeomUtils, "twoPointEquals", function(pointA, pointB) {
  return pointA.x === pointB.x && pointA.y === pointB.y;
});

rof(ASJS.GeomUtils, "twoPointAngle", function(pointA, pointB) {
  var dot = pointA.x * pointB.x + pointA.y * pointB.y;
  var det = pointA.x * pointB.y - pointA.y * pointB.x;
  var angle = Math.atan2(det, dot);
  return angle / ASJS.GeomUtils.THETA;
});

rof(ASJS.GeomUtils, "rectCutRect", function(rectA, rectB) {
  var newRectB = new ASJS.Rectangle(
    rectB.x      - rectA.width,
    rectB.y      - rectA.height,
    rectB.width  + rectA.width * 2,
    rectB.height + rectA.height * 2
  );
  return ASJS.GeomUtils.rectInRect(rectA, newRectB);
});

rof(ASJS.GeomUtils, "rectInRect", function(rectA, rectB) {
  return rectA.x >= rectB.x && rectA.y >= rectB.y &&
         rectA.x + rectA.width <= rectB.x + rectB.width &&
         rectA.y + rectA.height <= rectB.y + rectB.height;
});

rof(ASJS.GeomUtils, "localToGlobal", function(target, point) {
  var pos = new ASJS.Point(point.x, point.y);
  var child = target;
  while (child) {
    pos.x *= child.scaleX;
    pos.y *= child.scaleY;
    pos.x += child.x;
    pos.y += child.y;
    child = child.parent;
  }
  return pos;
});

rof(ASJS.GeomUtils, "globalToLocal", function(target, point) {
  var pos = new ASJS.Point(point.x, point.y);
  var child = target;
  var children = [child];
  while (child = child.parent) children.unshift(child);
  var i = 0;
  while (child = children[++i]) {
    pos.x -= child.x;
    pos.y -= child.y;
    pos.x /= child.scaleX;
    pos.y /= child.scaleY;
  }
  return pos;
});

rof(ASJS.GeomUtils, "hitTest", function(target, point) {
  var rotationDeg = - target.rotation * ASJS.GeomUtils.THETA;

  var rect = target.bounds;

  var globalPos = target.localToGlobal(new ASJS.Point(0, 0));
  var diffPoint = new ASJS.Point(
    point.x - (globalPos.x + rect.width * 0.5),
    point.y - (globalPos.y + rect.height * 0.5)
  );
  var rotatedDiffPoint = new ASJS.Point(
    diffPoint.x * Math.cos(rotationDeg) - diffPoint.y * Math.sin(rotationDeg),
    diffPoint.x * Math.sin(rotationDeg) + diffPoint.y * Math.cos(rotationDeg)
  );
  var recalcPoint = new ASJS.Point(
    point.x - (diffPoint.x - rotatedDiffPoint.x),
    point.y - (diffPoint.y - rotatedDiffPoint.y)
  );

  var localPoint = target.globalToLocal(recalcPoint);
  return localPoint.x >= 0 && localPoint.y >= 0 && localPoint.x <= rect.width && localPoint.y <= rect.height;
});
