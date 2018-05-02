var MobileUtils = createSingletonClass(
"MobileUtils",
ASJS.BaseClass,
function(_scope) {
  var _dpi;
  var _baseSize;
  var _type;
  var _useDPI;
  var _useScreenSize;
  var _isDesktop;

  _scope.new = function() {
    _dpi = 1;

    _baseSize = 0;

    _type          = MobileUtils.TYPE_WIDTH;
    _useDPI        = false;
    _useScreenSize = false;

    var isIOS = new RegExp("iPad", "i").test(navigator.userAgent) || new RegExp("iPhone", "i").test(navigator.userAgent);
    _isDesktop = !isIOS && (empty(navigator.maxTouchPoints) || navigator.maxTouchPoints === 0);

    calcDPI();
  }

  get(_scope, "isDesktop", function() { return _isDesktop;});

  get(_scope, "width", function() { return _useScreenSize ? stage.screenWidth : stage.stageWidth; });

  get(_scope, "height", function() { return _useScreenSize ? stage.screenHeight : stage.stageHeight; });

  prop(_scope, "type", {
    get: function() { return _type; },
    set: function(v) { _type = v; }
  });

  prop(_scope, "useDPI", {
    get: function() { return _useDPI; },
    set: function(v) { _useDPI = v; }
  });

  prop(_scope, "useScreenSize", {
    get: function() { return _useScreenSize; },
    set: function(v) { _useScreenSize = v; }
  });

  prop(_scope, "baseSize", {
    get: function() { return _baseSize; },
    set: function(v) { _baseSize = v; }
  });

  _scope.getOrientation = function() {
    return _scope.width > _scope.height ? MobileUtils.ORIENTATION_LANDSCAPE : MobileUtils.ORIENTATION_PORTRAIT;
  }

  _scope.getBrowserOrientation = function() {
    return stage.stageWidth > stage.stageHeight ? MobileUtils.ORIENTATION_LANDSCAPE : MobileUtils.ORIENTATION_PORTRAIT;
  }

  _scope.getDeviceOrientation = function() {
    return stage.screenWidth > stage.screenHeight ? MobileUtils.ORIENTATION_LANDSCAPE : MobileUtils.ORIENTATION_PORTRAIT;
  }

  _scope.getDPI = function() {
    return _dpi;
  }

  _scope.getScreenWidth = function(fp) {
    if (fp) return _scope.width;
    switch (_scope.type) {
      case MobileUtils.TYPE_WIDTH: return _scope.width;
      break;
      case MobileUtils.TYPE_HEIGHT: return _scope.height;
      break;
      case MobileUtils.TYPE_MINIMUM: return Math.min(_scope.width, _scope.height);
      break;
      case MobileUtils.TYPE_MAXIMUM: return Math.max(_scope.width, _scope.height);
      break;
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
    _dpi = Math.min(2, Math.max(1, window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI) || 1));
  }
});
msg(MobileUtils, "ORIENTATION_LANDSCAPE");
msg(MobileUtils, "ORIENTATION_PORTRAIT");
msg(MobileUtils, "TYPE_MINIMUM");
msg(MobileUtils, "TYPE_MAXIMUM");
msg(MobileUtils, "TYPE_WIDTH");
msg(MobileUtils, "TYPE_HEIGHT");
