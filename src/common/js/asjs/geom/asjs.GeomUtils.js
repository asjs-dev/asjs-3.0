require("./asjs.Point.js");

ASJS.GeomUtils = {};

helpers.constant(ASJS.GeomUtils, "THETA", Math.PI / 180);

helpers.constant(ASJS.GeomUtils, "pointInOrigo", function(point) {
  return point.x === 0 && point.y === 0;
});

helpers.constant(ASJS.GeomUtils, "twoPointDistance", function(pointA, pointB) {
  return Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2));
});

helpers.constant(ASJS.GeomUtils, "pointInRect", function(point, rect) {
  return point.x >= rect.x && point.x <= rect.x + rect.width &&
         point.y >= rect.y && point.y <= rect.y + rect.height;
});

helpers.constant(ASJS.GeomUtils, "twoPointEquals", function(pointA, pointB) {
  return pointA.x === pointB.x && pointA.y === pointB.y;
});

helpers.constant(ASJS.GeomUtils, "twoPointAngle", function(pointA, pointB) {
  return Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x) / ASJS.GeomUtils.THETA;
});

helpers.constant(ASJS.GeomUtils, "twoRectsIntersect", function(rectA, rectB) {
  var section        = ASJS.Rectangle.create();
      section.x      = Math.max(rectA.x, rectB.x);
      section.y      = Math.max(rectA.y, rectB.y);
      section.width  = Math.abs(Math.min((rectA.x + rectA.width) - section.x, (rectB.x + rectB.width) - section.x));
      section.height = Math.abs(Math.min((rectA.y + rectA.height) - section.y, (rectB.y + rectB.height) - section.y));

  var isRectIntersection = ASJS.GeomUtils.rectInRect(section, rectA) && ASJS.GeomUtils.rectInRect(section, rectB);

  section = null;

  return isRectIntersection;
});

helpers.constant(ASJS.GeomUtils, "rectInRect", function(rectA, rectB) {
  return rectA.x >= rectB.x && rectA.y >= rectB.y &&
         rectA.x + rectA.width <= rectB.x + rectB.width &&
         rectA.y + rectA.height <= rectB.y + rectB.height;
});

helpers.constant(ASJS.GeomUtils, "localToGlobal", function(target, point) {
  var pos = ASJS.Point.create(point.x, point.y);
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

helpers.constant(ASJS.GeomUtils, "globalToLocal", function(target, point) {
  var pos = ASJS.Point.create(point.x, point.y);
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

helpers.constant(ASJS.GeomUtils, "hitTest", function(target, point) {
  var rotationDeg = - target.rotation * ASJS.GeomUtils.THETA;

  var rect = target.bounds;

  var globalPos = target.localToGlobal(ASJS.Point.create(0, 0));
  var diffPoint = ASJS.Point.create(
    point.x - (globalPos.x + rect.width * 0.5),
    point.y - (globalPos.y + rect.height * 0.5)
  );

  var rotatedDiffPoint = ASJS.Point.create(
    diffPoint.x * Math.cos(rotationDeg) - diffPoint.y * Math.sin(rotationDeg),
    diffPoint.x * Math.sin(rotationDeg) + diffPoint.y * Math.cos(rotationDeg)
  );
  var recalcPoint = ASJS.Point.create(
    point.x - (diffPoint.x - rotatedDiffPoint.x),
    point.y - (diffPoint.y - rotatedDiffPoint.y)
  );

  var localPoint = target.globalToLocal(recalcPoint);
  var isHit = localPoint.x >= 0 && localPoint.y >= 0 && localPoint.x <= rect.width && localPoint.y <= rect.height;

  rect             =
  globalPos        =
  diffPoint        =
  rotatedDiffPoint =
  recalcPoint      =
  localPoint       = null;

  return isHit;
});

helpers.constant(ASJS.GeomUtils, "getQuadCenter", function(x1, y1, x2, y2, x3, y3, x4, y4) {
  var a = x1 * y2;
  var b = y1 * x2;
  var c = x3 - x4;
  var d = y3 - y4;
  var e = x1 - x2;
  var f = y1 - y2;
  var g = x3 * y4;
  var h = y3 * x4;
  var i = a - b;
  var j = g - h;
  var k = e * d;
  var l = f * c;
  var m = k - l;
  return {
    x: ((i * c) - (e * j)) / m,
    y: ((i * d) - (f * j)) / m
  };
});
