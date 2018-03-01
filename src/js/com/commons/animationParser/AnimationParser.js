var AnimationParser = createSingletonClass(
"AnimationParser",
ASJS.BaseClass, 
function(_scope) {
  _scope.createCSSAnimationsByJSON = function(list) {
    var i = -1;
    var l = list.length;
    var cssAnimations = [];
    while (++i < l) cssAnimations.push(_scope.createCSSAnimationByJSON(list[i]));
    return cssAnimations;
  }
  
  _scope.createCSSAnimationByJSON = function(animation) {
    return createAnimationCSS(animation);
  }
  
  function createAnimationCSS(data) {
    var pW = (data.imageSize.width / data.animationSize.width) * 100;
    var pH = (data.imageSize.height / data.animationSize.height) * 100;
        
    var animationCSSKeyframes = "@keyframes animation-key-" + data.id + " {\n";

    var i = -1;
    var l = data.frames.length;
    var frames = [];
    while (++i < l) {
      var frame = data.frames[i];
      var px = (data.imageSize.w !== 0 ? (frame.x / (data.imageSize.width - data.animationSize.width)) * 100 : 0);
      var py = (data.imageSize.h !== 0 ? (frame.y / (data.imageSize.height - data.animationSize.height)) * 100 : 0);
      var j = -1;
      var m = (frame.delay || 1) * (data.frameDelay || 1);
      
      var keyframe = "% {\n";
          keyframe += "    background-position : " + px + "% " + py + "%;\n";
          keyframe += "  }\n";
      while (++j < m) frames.push(keyframe);
    }
    
    i = -1;
    l = frames.length;
    while (++i < l) animationCSSKeyframes += "  " + ((i / l) * 100) + frames[i];
    animationCSSKeyframes += "}";
    
    var animationCSS = ".animation-" + data.id + " {\n";
        animationCSS += "  background-image          : url(" + data.image + ");\n";
        animationCSS += "  background-size           : " + pW + "% " + pH + "%;\n";
        animationCSS += "  animation                 : animation-key-" + data.id + " steps(1) " + ((1000 / 24) * frames.length) + "ms;\n";
        animationCSS += "  animation-iteration-count : " + (data.repeat > 0 ? data.repeat : "infinite") + ";\n";
        animationCSS += "  animation-direction       : " + (data.reverse ? "reverse" : "normal") + ";\n";
        animationCSS += "}\n";
        animationCSS += animationCSSKeyframes;
    
    return animationCSS;
  }
});
