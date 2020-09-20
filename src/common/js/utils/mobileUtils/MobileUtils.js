require("../../helpers/createClass.js");
require("../../helpers/BaseClass.js");
require("../../helpers/isEmpty.js");
require("../../helpers/property.js");
require("../../helpers/message.js");
require("../../helpers/mathHelper.js");

require("../NameSpace.js");

helpers.createSingletonClass(ASJSUtils, "MobileUtils", helpers.BaseClass, function(_scope) {
  var _dpi;
  var _isIOS;
  var _isSafari;
  var _isDesktop;

  _scope.baseSize;
  _scope.type;
  _scope.useDPI;
  _scope.useScreenSize;

  _scope.new = function() {
    _dpi = 1;

    _scope.baseSize      = 0;
    _scope.type          = ASJSUtils.MobileUtils.TYPE_WIDTH;
    _scope.useDPI        = false;
    _scope.useScreenSize = false;

    _isSafari  = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);;
    _isIOS     = /iPad|iPhone|iPod/.test(navigator.userAgent);
    _isDesktop = !_isIOS && (helpers.isEmpty(navigator.maxTouchPoints) || navigator.maxTouchPoints === 0);

    calcDPI();
  }

  helpers.get(_scope, "isSafari", function() { return _isSafari; });
  helpers.get(_scope, "isIOS", function() { return _isIOS; });
  helpers.get(_scope, "isDesktop", function() { return _isDesktop; });
  helpers.get(_scope, "width", function() { return _scope.useScreenSize ? stage.screenWidth : stage.stageWidth; });
  helpers.get(_scope, "height", function() { return _scope.useScreenSize ? stage.screenHeight : stage.stageHeight; });

  _scope.getOrientation = function() {
    return _scope.width > _scope.height ? ASJSUtils.MobileUtils.ORIENTATION_LANDSCAPE : ASJSUtils.MobileUtils.ORIENTATION_PORTRAIT;
  }

  _scope.getBrowserOrientation = function() {
    return stage.stageWidth > stage.stageHeight ? ASJSUtils.MobileUtils.ORIENTATION_LANDSCAPE : ASJSUtils.MobileUtils.ORIENTATION_PORTRAIT;
  }

  _scope.getDeviceOrientation = function() {
    return stage.screenWidth > stage.screenHeight ? ASJSUtils.MobileUtils.ORIENTATION_LANDSCAPE : ASJSUtilsS.MobileUtils.ORIENTATION_PORTRAIT;
  }

  _scope.getDPI = function() {
    return _dpi;
  }

  _scope.isLandscape = function() {
    return _scope.getOrientation() === ASJSUtils.MobileUtils.ORIENTATION_LANDSCAPE;
  }

  _scope.getScreenWidth = function(fp) {
    if (fp) return _scope.width;
    switch (_scope.type) {
      case ASJSUtils.MobileUtils.TYPE_WIDTH: return _scope.width;
      case ASJSUtils.MobileUtils.TYPE_HEIGHT: return _scope.height;
      case ASJSUtils.MobileUtils.TYPE_MINIMUM: return Math.min(_scope.width, _scope.height);
      case ASJSUtils.MobileUtils.TYPE_MAXIMUM: return Math.max(_scope.width, _scope.height);
    }
  }

  _scope.getRatio = function(fp) {
    return _scope.getScreenWidth(fp) / _scope.baseSize;
  }

  _scope.convertRatio = function(v, fp, useDPI) {
    return Math.floor((_scope.getRatio(fp) * v) * (useDPI || _scope.useDPI ? _scope.getDPI() : 1));
  }

  _scope.preventMobileScrolling = function() {
    stage.addEventListener(ASJS.MouseEvent.TOUCH_MOVE, function(e) { e.preventDefault(); });
  }

  function calcDPI() {
    _dpi = helpers.between(1, 2, window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI) || 1);
  }
});
helpers.message(ASJSUtils.MobileUtils, "ORIENTATION_LANDSCAPE");
helpers.message(ASJSUtils.MobileUtils, "ORIENTATION_PORTRAIT");
helpers.message(ASJSUtils.MobileUtils, "TYPE_MINIMUM");
helpers.message(ASJSUtils.MobileUtils, "TYPE_MAXIMUM");
helpers.message(ASJSUtils.MobileUtils, "TYPE_WIDTH");
helpers.message(ASJSUtils.MobileUtils, "TYPE_HEIGHT");
