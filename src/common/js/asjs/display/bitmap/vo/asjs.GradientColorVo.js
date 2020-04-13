/* TODO: createUtility */
createUtility(ASJS, "GradientColorVo");
rof(ASJS.GradientColorVo, "create", function(stop, color) {
  return {
    "stop"  : stop || 0,
    "color" : color || ASJS.Color.create()
  };
});
