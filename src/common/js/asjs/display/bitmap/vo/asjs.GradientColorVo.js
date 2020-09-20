ASJS.GradientColorVo = {};
helpers.constant(ASJS.GradientColorVo, "create", function(stop, color) {
  return {
    "stop"  : helpers.valueOrDefault(stop, 0),
    "color" : helpers.valueOrDefault(color, ASJS.Color.create())
  };
});
