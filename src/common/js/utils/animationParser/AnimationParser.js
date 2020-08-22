require("../../NameSpace.js");

createSingletonClass(ASJSUtils, "AnimationParser", BaseClass, function(_scope) {
  var priv = {};
  cnst(priv, "DEFAULT_FPS", 1000 / 24);

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

    var isImageWidthNotZero = data.imageSize.width !== 0;
    var isImageHeightNotZero = data.imageSize.height !== 0;

    var restWidth = data.imageSize.width - data.animationSize.width;
    var restHeight = data.imageSize.height - data.animationSize.height;

    var i = -1;
    var l = data.frames.length;
    var frames = [];
    while (++i < l) {
      var frame = data.frames[i];
      var px = (isImageWidthNotZero ? (frame.x / restWidth) * 100 : 0);
      var py = (isImageHeightNotZero ? (frame.y / restHeight) * 100 : 0);
      var j = -1;
      var m = (frame.delay || 1) * (data.frameDelay || 1);

      var keyframe = "background-position : " + px + "% " + py + "%;";
      while (++j < m) frames.push(keyframe);
    }

    i = -1;
    l = frames.length;
    var animationCSSKeyframes = "@keyframes animation-key-" + data.id + " {";
    while (++i < l) animationCSSKeyframes += "  " + ((i / l) * 100) + "% {" + frames[i] + "}";
    animationCSSKeyframes += "}";

    var animationCSS = ".animation-" + data.id + " {";
        animationCSS += "background-image: url(" + data.image + ");";
        animationCSS += "background-size: " + pW + "% " + pH + "%;";
        animationCSS += "animation: animation-key-" + data.id + " steps(1) " + ((data.fps || priv.DEFAULT_FPS) * frames.length) + "ms;";
        animationCSS += "animation-iteration-count: " + (data.repeat > 0 ? data.repeat : "infinite") + ";";
        animationCSS += "animation-direction: " + (data.reverse ? "reverse" : "normal") + ";";
        animationCSS += "}";
        animationCSS += animationCSSKeyframes;

    return animationCSS;
  }
});
