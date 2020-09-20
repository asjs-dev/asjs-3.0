require("../../helpers/createClass.js");
require("../../helpers/BaseClass.js");
require("../../helpers/constant.js");

require("../NameSpace.js");

helpers.createSingletonClass(ASJSUtils, "Media", helpers.BaseClass, function(_scope) {
  _scope.getUserMedia = function(constraints, callback, errorCallback) {
    navigator.getUserMedia(constraints, callback, errorCallback);
  }

  _scope.getAudioConstraints = function() {
    return { audio: true };
  }

  _scope.getVideoConstraints = function(width, height, facingMode, frameRateIdeal, frameRateMax) {
    var constraints = { video: true };
    if (width) constraints.video.width = width;
    if (height) constraints.video.height = height;
    if (facingMode) constraints.video.facingMode = facingMode;
    if (frameRateIdeal || frameRateMax) {
      constraints.video.frameRate = {};
      if (frameRateIdeal) constraints.video.frameRate.ideal = frameRateIdeal;
      if (frameRateMax) constraints.video.frameRate.max = frameRateMax;
    }
    return constraints;
  }

  _scope.isSupported = function() {
    return !!navigator.getUserMedia;
  }
});
helpers.constant(ASJSUtils.Media, "FACING_MODE_USER",        "user");
helpers.constant(ASJSUtils.Media, "FACING_MODE_ENVIRONMENT", "environment");
