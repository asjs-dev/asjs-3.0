ASJS.Point = {};
helpers.constant(ASJS.Point, "create", function(x, y) {
  return {
      "x" : helpers.valueOrDefault(x, 0),
      "y" : helpers.valueOrDefault(y, 0)
  };
});
