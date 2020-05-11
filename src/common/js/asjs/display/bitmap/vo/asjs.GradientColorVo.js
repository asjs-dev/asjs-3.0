createUtility(ASJS, "GradientColorVo");
rof(ASJS.GradientColorVo, "create", function(stop, color) {
  return {
    "stop"  : valueOrDefault(stop, 0),
    "color" : valueOrDefault(color, ASJS.Color.create())
  };
});
